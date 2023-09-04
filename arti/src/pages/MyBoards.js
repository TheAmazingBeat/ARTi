import '../styles/pages/MyBoards.css'
import {
  Container,
  Row,
  Col,
  FormControl,
  Modal,
  Button,
  Image,
  Spinner,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import React, { useState, useContext, createContext, useRef } from 'react'
import axios from 'axios'
import Board from '../components/Board'
import { UserAndBoardContext } from '../App'
import BoardPopup from '../components/BoardPopup'
import Backdrop from '../components/Backdrop'
import { ColorExtractor } from 'react-color-extractor'

export const BoardsStateContext = createContext()

const MyBoards = () => {
  const thisRef = useRef(null)
  const { user, boards, setBoards } = useContext(UserAndBoardContext)
  // const [searchTerm, setSearchTerm] = useState('')
  // const [newBoardName, setNewBoardName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newImageURL, setNewImageURL] = useState('')
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedImagePrompt, setSelectedImagePrompt] = useState('')
  const [colorPalette, setColorPalette] = useState([])
  const boardNameRef = useRef(null)
  const searchRef = useRef(null)

  const boardStateValues = {
    user,
    selectedBoard,
    setSelectedBoard,
    showImageModal,
    setShowImageModal,
    selectedImage,
    setSelectedImage,
    newImageURL,
    setNewImageURL,
    showModal,
    setShowModal,
    selectedImagePrompt,
    setSelectedImagePrompt,
  }

  // Manually calling the the API to get all the boards of the user
  async function getBoards(user) {
    const username = user.username
    const getUrl = `/api/v1/boards/${username}`
    try {
      const response = await axios(getUrl)
      return response.data
    } catch (error) {
      console.log(error.message)
    }
  }

  // Calling the API to update the database for a new board of the user
  async function createNewBoard(user, newBoardName) {
    const username = user.username
    const boardName = newBoardName
    const images = []
    const thumbnail = null
    const customThumbnail = false

    // Prevents creating a board with same name on the front-end
    if (boards.some((board) => board.boardName === newBoardName)) {
      alert('A board with this name already exists.')
      return
    }

    try {
      const postUrl = '/api/v1/boards'
      const response = await axios.post(postUrl, {
        username: username,
        boardName: boardName,
        images: images,
        thumbnail: thumbnail,
        customThumbnail: customThumbnail,
      })

      console.log('Created a new board: ', response.data)

      // Updating how boards should be rendered on the page using useState
      if (boards === undefined) setBoards([response.data])
      else {
        const bArr = await [...boards, response.data]
        console.log('Updated state of boards: ', bArr)
        setBoards(bArr)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // Calling the API to update the database for the deleted board
  async function deleteBoard(user, deleteThisBoard) {
    try {
      const username = user.username
      const boardName = deleteThisBoard
      console.log(`trying to delete this board ${boardName}`)
      const postUrl = `/api/v1/boards/${username}`
      const response = await axios.post(postUrl, { boardName: boardName })

      console.log('Deleted a board: ', response.data)

      // Updating how boards should be rendered on the page using useState
      if (boards === undefined) setBoards([response.data])
      else {
        // TODO :: this is prob inefficient since im calling the api again but at least it's safe
        // const bArr = await getBoards(user)
        const bArr = await boards.filter(
          (board) => board.boardName !== boardName
        )
        console.log('Updated state of boards: ', bArr)
        setBoards(bArr)
      }

      setSelectedBoard(null) // closes the BoardsPopup
    } catch (error) {
      console.log(error.message)
    }
  }

  // Calling the API to delete the imageToDelete from the one of the user's boards
  async function deleteImage(user, userBoard, imageToDelete) {
    try {
      const username = user.username
      const boardName = userBoard
      const imagesToDelete = imageToDelete
      console.log('deleting details: ', {
        boardName: boardName,
        selectedImage: imageToDelete,
      })
      console.time('deleteImage')
      const isCustomThumbnail = user.customThumbnail
      const postUrl = `/api/v1/boards/${username}/add-delete`

      // binary search since image id's are sorted
      console.log(boards)

      const response = await axios.post(postUrl, {
        boardName: boardName,
        imageUpdates: [imagesToDelete],
        deleteImage: true,
        isCustomThumbnail: isCustomThumbnail,
      })

      console.log('Deleted an image: ', response.data)
      console.timeEnd('deleteImage')

      setShowImageModal(false)

      // This is re-rendering boards by mutating the boards on the front-end (idk which is better -- calling api or mutating on front-end)
      const newBoards = boards.map((board) => {
        if (board.boardName === response.data.boardName) return response.data
        else return board
      })
      setBoards(newBoards)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    // setSearchTerm(event.target.value)
    // just for a loading effect
    setBoards([])
    let currentBoards
    if (boards === undefined) currentBoards = await getBoards(user)
    else currentBoards = boards
    const filteredBoards = currentBoards.filter((board) => {
      console.log(board.boardName.includes(searchRef.current.value))
      return board.boardName.includes(searchRef.current.value)
    })
    console.log(searchRef.current.value)
    if (searchRef.current.value === '') setBoards(currentBoards)
    else if (filteredBoards.length === 0) setBoards(undefined)
    else setBoards(filteredBoards)
  }

  return (
    <BoardsStateContext.Provider value={boardStateValues}>
      <Container>
        <Backdrop></Backdrop>

        <Row className='py-4'>
          <Col xs={12}>
            <h1>{user.username}'s Boards </h1>
          </Col>
        </Row>

        {/* Search Board */}
        <Row className='py-4'>
          <Col xs={12}>
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <FormControl
                  type='text'
                  placeholder='Search for Board...'
                  // value={searchTerm}
                  // onChange={handleSearch}
                  ref={searchRef}
                />
                <Button variant='secondary' type='submit'>
                  <i className='bi bi-search'></i>
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        {/* Create Board Button */}
        <Row>
          <div className='create-wrapper'>
            <Button
              variant='primary'
              onClick={() => setShowModal(true)}
              className='add-boards-button'
            >
              Create Board
            </Button>
          </div>
        </Row>

        {/* Modal for creating new boards */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false)
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Board</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Name your board</p>
            <FormControl
              type='text'
              placeholder='e.g. background inspo'
              // value={newBoardName}
              // onChange={(e) => setNewBoardName(e.target.value)}---onChange makes it slow
              ref={boardNameRef}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => {
                createNewBoard(user, boardNameRef.current.value)
                setShowModal(false)
              }}
            >
              Add Board
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Row of boards */}
        <Row className='boards-container py-4' ref={thisRef}>
          {/* Renders a spinner to show loading if boards is empty */}
          {boards !== undefined ? (
            boards.length === 0 ? (
              <Col className='d-flex justify-content-center'>
                <Spinner animation='border' />
              </Col>
            ) : (
              boards.map((board, boardIndex) => {
                return (
                  <Board
                    key={board.boardName}
                    board={board}
                    boardIndex={boardIndex}
                    deleteBoard={deleteBoard}
                  />
                )
              })
            )
          ) : (
            <Col className='text-center'>No Boards found</Col>
          )}
        </Row>

        {/* Popup when Board is clicked */}
        {selectedBoard !== null && (
          <BoardPopup boards={boards} deleteBoard={deleteBoard} />
        )}

        {/* Modal that shows when clicking image in BoardPopup */}
        <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='w-100 d-flex justify-content-center'>
              <Image src={newImageURL} alt={selectedImagePrompt} fluid />
            </div>
            <Row className='my-3'>
              <h4>Prompt:</h4>
              <p>{selectedImagePrompt}</p>
            </Row>
            <Row className='my-3'>
              <ColorExtractor
                src={newImageURL}
                getColors={(colors) => setColorPalette(colors)}
              />
              <h4>Color Palette:</h4>
              <div className='color-palettes'>
                {colorPalette !== undefined ? (
                  colorPalette.map((color, i) => {
                    return (
                      <OverlayTrigger
                        key={i}
                        placement='top'
                        overlay={<Tooltip id={`tooltip-${i}`}>{color}</Tooltip>}
                      >
                        <button
                          style={{
                            backgroundColor: color,
                            width: '50px',
                            height: '50px',
                          }}
                          className='color-swatch'
                        ></button>
                      </OverlayTrigger>
                    )
                  })
                ) : (
                  <></>
                )}
              </div>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary'>Set As Thumbnail</Button>
            <Button
              variant='secondary'
              onClick={() => setShowImageModal(false)}
            >
              Close
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                deleteImage(
                  user,
                  boards[selectedBoard].boardName,
                  selectedImage
                )
              }}
            >
              Delete Image
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </BoardsStateContext.Provider>
  )
}
// not yet needed - but soon...
async function changeThumbnailOrBoardName(user) {
  try {
    const username = user.username
    const boardName = user.boardName
    const thumbnailImage = ''
    const newBoardName = ''
    const patchUrl = `/api/v1/boards/${username}/${boardName}`

    const response = await axios.patch(patchUrl, {
      newThumbnailUrl: thumbnailImage,
      newBoardName: newBoardName,
    })
    console.log(response)
  } catch (error) {
    console.log(error.message)
  }
}

export default MyBoards
