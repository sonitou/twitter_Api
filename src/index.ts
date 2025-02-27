import express from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFile } from './utils/file'
import { config } from 'dotenv'
config()
databaseService.connect()
const app = express()
const port = process.env.PORT || 4000
initFile()
app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler as express.ErrorRequestHandler)

// Khởi động server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`)
})
