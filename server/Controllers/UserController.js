import createHttpError from 'http-errors'
import { User, validate } from '../Models/user.model.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import fs from 'fs'
import jwt from 'jsonwebtoken'
// import { fileURLToPath } from 'url'
// import { dirname } from 'path'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
import path from 'path'
const __dirname = path.resolve()

// FOR US ONLY :: query for all users
async function getAllUsers(req, res) {
  try {
    const result = await User.find({}) // no filter means all
    res.send(result)
  } catch (error) {
    console.log(error)
  }
}

// FOR SIGNUP :: this creates a new user and passes to database
async function createUser(req, res, next) {
  try {
    const { error } = validate(req.body) // Check if request body is parsed correctly
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    // Checks if user already exists
    const user = await User.findOne({ email: req.body.email })
    if (user)
      return res.status(409).send({
        message: 'There is a user that already exists with the same email!',
      })

    // Hashing password
    const salt = await bcrypt.genSalt(Number(10))
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const result = await new User({
      ...req.body,
      password: hashPassword,
    }).save()

    res.send(result)
  } catch (error) {
    console.error(error.message)
    if (error.name === 'ValidationError')
      next(createHttpError(422, error.message))
  }
}

// FOR US ONLY :: querying a user with their username
async function getUser(req, res, next) {
  try {
    const userName = req.params.username
    const result = await User.findOne({ username: userName })
    res.send(result)
  } catch (error) {
    console.error(error.message)
    if (error instanceof mongoose.CastError) {
      next(createError(400, 'Invalid username'))
      return
    }
    next(error)
  }
}

// Returns basic info of the user back to the client
async function getUserAuthorized(req, res, next) {
  try {
    const clientToken = req.body.token
    const username = req.body.username

    // verifying jwt token
    // const cert = fs
    //   .readFileSync(path.join(__dirname, 'public', 'public.pem'), 'utf-8')
    //   .toString()
    const cert = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----`
    jwt.verify(clientToken, cert, async (err, decoded) => {
      if (err) {
        console.error('From getUserAuthorized: ', err.message)
      } else {
        // only give back basic user info to client if token is verified
        const userPrivate = await User.aggregate([
          { $match: { username: username } },
          { $project: { password: 0 } },
        ])
        res.status(200).send(userPrivate[0])
      }
    })
  } catch (error) {
    console.log(error.message)
    if (error instanceof mongoose.CastError) {
      next(createError(400, 'Invalid username'))
      return
    }
    next(error)
  }
}

// Any updates to the user
// If editing user in settings page, allow user the ability to edit everything at once
// then after clicking save or submit, call this endpoint
async function updateUser(req, res, next) {
  try {
    const { token, ...rest } = req.body
    const clientToken = token
    const cert = fs.readFileSync('./public.pem')

    // verifying token
    jwt.verify(clientToken, cert, async (err, decoded) => {
      if (err) throw new Error(err)
      else {
        // TODO :: if password is changed, verify password format
        const userName = req.params.username
        const updates = rest // allows any field to be changed
        const options = { new: true }

        const result = await User.findOneAndUpdate(
          { username: userName },
          updates,
          options
        )

        res.send(result)
      }
    })
  } catch (error) {
    console.log(error.message)
    if (error instanceof mongoose.CastError) {
      next(createError(400, 'Invalid username'))
      return
    }
  }
}

// Deletes a user from the database
async function deleteUser(req, res, next) {
  const token = req.body.token
  if (!token) {
    res.status()
  }
  try {
    const userName = req.params.username
    const result = await User.findOneAndDelete({ username: userName })
    res.send(result)
  } catch (error) {
    console.log(error.message)
    if (error instanceof mongoose.CastError) {
      next(createError(400, 'Invalid username'))
      return
    }
  }
}

async function uploadProfilePic(req, res, next) {
  const token = req.body.token
  if (!token) res.status(401).send('User is unauthorized')

  try {
    const userName = req.params.username
    const file = req.body.file
    const result = await User.findOneAndUpdate(
      { username: userName },
      {
        profilePicture: '',
      }
    )
    res.status(200).send(result)
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(400, 'Invalid username'))
      return
    }
  }
}

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserAuthorized,
  uploadProfilePic,
}
