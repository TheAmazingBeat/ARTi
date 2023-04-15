import '../index.css'
import styles from '../styles/image-gen.module.css'
import GenerateBtn from '../components/GenerateBtn'
import { Row, Col, Container, Button } from 'react-bootstrap'
import { useState } from 'react'
import PopUp from '../components/PopUp'
import '../styles/PopUp.css'
import axios from 'axios'
import Backdrop from '../components/Backdrop'

const ImageGen = () => {
  //button functionality of popup, show/hide popup
  const [show, setShow] = useState(false)
  const [promptInput, setPrompt] = useState('')
  const [image, setImage] = useState({})
  const [showSaving, setShowSaving] = useState(false)

  // Functions for showing/closing modal popup
  const handleShow = async () => {
    try {
      setShow(true)
      // gets the boards owned by user
      // const response = await axios(`/api/v1/boards/${user.username}`)
      // if (response.status === 200) {
      //   setBoards(response.data)
      //   console.log('calling api', boards)
      // }
    } catch (error) {
      console.error(error.message)
    }
  }
  const handleClose = () => {
    setShow(false)
    setShowSaving(false)
  }

  // Submits the prompt to generate an image from our API
  async function handleSubmit(e) {
    e.preventDefault()

    const postUrl = '/api/v1/imageai'
    try {
      if (promptInput.match('[a-z0-9]')) {
        // makes sure that there is a prompt
        const response = await axios.post(postUrl, { prompt: promptInput })
        if (response.status === 200) {
          const id = response.data.response.id
          // const url = `data:image/png;base64,${response.data.response.url}`
          setImage({
            id: id,
            data: response.data.response.url,
            prompt: response.data.response.prompt,
          })
          await console.log('this is from image gen ', image)
          handleShow()
        }
      } else throw new Error('No Prompt Entered!')
    } catch (error) {
      console.log(error.message)
    }
  }

  const onChangeHandler = (event) => {
    setPrompt(event.target.value)
  }

  async function randomizePrompt() {
    const postUrl = '/api/v1/text'
    try {
      const response = await axios.post(postUrl)
      if (response.status === 200) {
        const randomizePrompt = response.data.prompt
        setPrompt(randomizePrompt)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='generator-container'>
      <Backdrop> </Backdrop>
      <Container>
        <div className='image-input-container'>
          <Row>
            <Col>
              <h3>Enter a detailed description for what you want to create.</h3>

              <div className='generate-bar mb-3'>
                <input
                  className='image-input'
                  onChange={onChangeHandler}
                  type='text'
                  placeholder='Enter your prompt...'
                  value={promptInput}
                />
                <GenerateBtn onClick={handleSubmit} text='Generate' />
              </div>
              <div className={`${styles['btn-wrapper']}`}>
                <Button variant='secondary' onClick={randomizePrompt}>
                  Randomize Prompt
                </Button>
              </div>
              <div className='popup-container'>
                <div className='generated-img'>
                  {/* <button
            className='popup-button'
            variant='primary'
            onClick={handleShow}
          >
            <i className='bi bi-plus-lg'></i>
          </button> */}

                  <PopUp
                    show={show}
                    handleClose={handleClose}
                    image={image}
                    showSaving={showSaving}
                    setShowSaving={setShowSaving}
                  />

                  {/* <img
              src='https://pbs.twimg.com/media/EbvB35oXgAAiQsH.jpg'
              alt='img of travis scott raging'
              className='img'
            /> */}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* <img src={imageUrl} alt={promptInput} className='img' /> */}
    </div>
  )
}
export default ImageGen
