import '../styles/pages/PortraitGen.css'
import PortraitGenBtn from '../components/PortraitGenBtn'
import { useRef, useState } from 'react'
import axios from 'axios'
import Backdrop from '../components/Backdrop'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'

const PortraitGen = () => {
  const ageInput = useRef(null)
  const [image, setImage] = useState('')
  const [sexOption, setSexOption] = useState('')
  // const [boardsArray, setBoardsArray] = useState([])

  //Function calls the portrait gen api
  async function handleChange() {
    const age = ageInput.current.value
    // const gender = genderInput.current.value
    let url = ''

    if (age === '' && sexOption === 'None') {
      url = 'https://fakeface.rest/face/json'
    } else if (age === '' && (sexOption === 'male' || 'female')) {
      url = `https://fakeface.rest/face/json?gender=${sexOption}`
    } else if (age !== '' && sexOption === 'None') {
      const max_age = parseInt(age) + 1
      const min_age = parseInt(age) - 1
      url = `https://fakeface.rest/face/json?minimum_age=${min_age}&maximum_age=${max_age}`
    } else {
      const max_age = parseInt(age) + 1
      const min_age = parseInt(age) - 1
      url = `https://fakeface.rest/face/json?minimum_age=${min_age}&maximum_age=${max_age}&gender=${sexOption}`
    }
    console.log(url)

    axios
      .get(url)
      .then((res) => {
        const uri = res.data.image_url
        setImage(uri)
        console.log(`image: ${image}`)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <div className='portrait-gen-container'>
      <Backdrop></Backdrop>
      {/* <header>
      <h1>
        Portrait Generator
      </h1>
      </header> */}

      <Container>
        <div className='portrait-input-container'>
          <h2>What will this portrait look like?</h2>

          <Row className='text-inputs my-2'>
            {/* Row for Age */}
            <Col xs={12} md={6} className='my-2'>
              <input
                ref={ageInput}
                className='age-input'
                type='number'
                placeholder='Age'
              />
            </Col>

            <Col xs={12} md={6} className='my-2'>
              <Dropdown>
                <Dropdown.Toggle className='gender-input'>Sex</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSexOption('Female')}>
                    Female
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSexOption('Male')}>
                    Male
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* <div className='gender-input'>
                  <label htmlFor='Gender'>Gender</label>
                  <select ref={genderInput} name='Gender' id='Gender'>
                    <option>None</option>
                    <option value='female'>female</option>
                    <option value='male'>male</option>
                  </select>
                </div> */}
            </Col>
          </Row>

          <Row className='my-2'>
            <PortraitGenBtn onClick={handleChange} text='Generate' />
          </Row>

          {image && <img src={image} alt='AI Face' />}
          {/* <button type='button' onClick={handleChange}>
            New image
          </button> */}
        </div>

        <div className='popup-container'>
          {/* <button onClick={() => setButtonPopup(true)}>save</button> */}
          {/* <PopUp
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
          boards={boardsArray}
        ></PopUp> */}
        </div>
      </Container>
    </div>
  )
}

export default PortraitGen
