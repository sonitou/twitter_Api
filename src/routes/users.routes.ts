import { Router } from 'express'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
import { access } from 'fs'

const usersRouter = Router()

/**
 * Description. login a new user
 * Path: /login
 * Method: GET
 * Body: { email: string, password: string}
 */
usersRouter.get('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: {name: string, email: string, password: string, confirm_password,
 * data_of_birth: IS08601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * Description. logout a new user
 * Path: /logout
 * Method: POST
 * Headers: {Authorization: Bearer token <access_token>}
 * Body: {refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
export default usersRouter
