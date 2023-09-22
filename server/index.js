import express from 'express'
import createHttpError from 'http-errors'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import dbInit from './db.init.js'
// Routes
import { UserRoute } from './Routes/User.route.js'
import { BoardsRoute } from './Routes/Boards.route.js'
import { AuthRoute } from './Routes/Auth.route.js'
import { ApiRouter } from './Routes/Api.route.js'
import { TextCompleteRouter } from './Routes/TextComplete.route.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' })) // allows express to parse req.body
app.use(express.urlencoded({ extended: true }))
app.set('Access-Control-Allow-Origin', '*')

const PORT = 8080 || process.env.PORT

dbInit(process.env.MONGODB_URI)

app.get('/', (req, res) => {
  res.send('Hello World')
})

// USER ROUTES
app.use('/api/v1/user', UserRoute)
app.use('/api/v1/boards', BoardsRoute)
app.use('/api/v1/imageai', ApiRouter)
// LOGIN AUTHENTICATION
app.use('/api/v1/auth', AuthRoute)
app.use('/api/v1/text', TextCompleteRouter)

// 404 handler and pass to error handler
app.use((req, res, next) => {
  next(createHttpError(404, 'Not found'))
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
