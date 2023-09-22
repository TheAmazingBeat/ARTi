import express from 'express'
const router = express.Router()
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserAuthorized,
  updateUser,
  uploadProfilePic,
} from '../Controllers/UserController.js'

// Gets all the users
// router.get('/', getAllUsers)

// Creating a new user -> would this be signup???
router.post('/', createUser)

// Getting a user based on their username - would this be login
// router.get('/:username', getUser)

// This route gives the details of the profile back to the client (e.g. name)
router.post('/get', getUserAuthorized) // post is required for client to pass token

// Updating a user - any field
router.patch('/:username', updateUser)

// Deleting an existing user
// router.delete('/:username', deleteUser)

// Upload a profile picture
router.post('/:username/profile-pic', uploadProfilePic)

export { router as UserRoute }
