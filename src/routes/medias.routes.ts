import { Router } from 'express'
import {
  serveVideoStreamController,
  uploadImageController,
  uploadVideoController
} from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()

mediasRouter.get(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)
mediasRouter.get(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

mediasRouter.get(
  '/video-stream/:name',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(serveVideoStreamController)
)
export default mediasRouter
