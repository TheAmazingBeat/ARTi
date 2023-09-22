import '../styles/pages/Login.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { storeUser, handleUser } from '../utils/Auth'

import { Col, Row, Form, InputGroup, Button } from 'react-bootstrap'

import LoginCarousel from '../components/LoginCarousel'

const LoginForm = ({ loggedIn, setLoggedIn, setUser }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loginStatus, setLoginStatus] = useState('')

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {
    if (loggedIn) navigate('/imagegen')
  })

  // Updates the username and password states
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      }
    })
  }

  // Submitting a form will POST username and password to API and API gives a token & username when logged in
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await axios.post('/api/v1/auth', {
        username: formData.username,
        password: formData.password,
      })
      if (response.status === 200) {
        // stores user in sessionStorage for easy access
        storeUser(response.data.data)
        // Sets the loggedIn prop (a state in App.js) to true
        setLoginStatus('Logged in successfully!')
        setLoggedIn(true)
        // Allows App.js to have data of user
        setUser(
          handleUser({
            token: response.data.data.token,
            username: formData.username,
          })
        )

        // immediately goes to imagegen after loggin in
        navigate('/imagegen')
      }
    } catch (error) {
      if (error.response.status === 400)
        // not everything was filled out
        setLoginStatus('Please fill in the required fields')
      else if (error.response.status === 401)
        // Unauthorized
        setLoginStatus('Invalid Username or Password')
      else {
        setLoginStatus('Something went wrong')
        console.error(error.message)
      }
    }
  }

  // toggles the state of showPassword
  const togglePassword = () => {
    setShowPassword((current) => !current)
  }

  return (
    <Row className='login-container'>
      <Col sm='6' className=' side-column'>
        <LoginCarousel></LoginCarousel>
      </Col>
      <Col sm='6' className='my-4'>
        <div className='side-container'>
          <div className='w-75'>
            <h1 className='welcome-title'>
              Welcome to{' '}
              <span className='arti-title'>
                ART<em>i</em>
              </span>
              .
            </h1>
            <h2 className='welcome-subtitle'>Please enter your details.</h2>
          </div>

          <Form className='my-3 w-75' onSubmit={handleSubmit}>
            <h3 className='username-field'>
              {' '}
              Username <span className='asterisk'> * </span>{' '}
            </h3>
            {/* USERNAME INPUT */}
            <InputGroup className='mb-3'>
              {/* <FloatingLabel className='mb-3' controlId='usernameInput'> */}
              <Form.Control
                className='login-input usernameInput'
                placeholder='abc123'
                onChange={handleChange}
                name='username'
              />
              {/* </FloatingLabel> */}
            </InputGroup>

            <h3 className='password-field'>
              {' '}
              Password <span className='asterisk'> * </span>{' '}
            </h3>
            {/* PASSWORD INPUT */}
            <InputGroup className='mb-3'>
              {/* <FloatingLabel label='**********' controlId='passwordInput'> */}
              <Form.Control
                className='login-input'
                // The showPassword state lets the input to toggle the visibility of the text
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                name='password'
                onChange={handleChange}
              />
              {/* </FloatingLabel> */}
              <Button
                variant='secondary'
                className='toggle-password-btn'
                onClick={togglePassword}
              >
                <i
                  // inside the className is what toggles the icon for the button
                  className={
                    showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'
                  }
                ></i>
              </Button>
            </InputGroup>

            <Button
              variant='secondary'
              type='submit'
              className='login-btn w-100'
            >
              <span className='login-button-style'>Login.</span>
            </Button>

            {/* Login Status */}
            <div
              className={`my-2 text-center ${
                loginStatus === 'Logged in successfully!'
                  ? 'text-success'
                  : 'text-danger'
              }`}
            >
              <p>{loginStatus}</p>
            </div>
          </Form>

          {/* Footer */}
          <footer>
            <Link to='/signup'>New to ARTi? Sign Up.</Link>
          </footer>
        </div>
      </Col>
    </Row>
  )
}

export default LoginForm
