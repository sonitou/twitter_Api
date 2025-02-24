import express from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFile } from './constants/file'
databaseService.connect()
const app = express()
const port = 4000
initFile()
app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler as express.ErrorRequestHandler)

// Khởi động server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`)
})
