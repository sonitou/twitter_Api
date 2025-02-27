import { RequestHandler, Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description. login a new user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description: Refresh token
 * path /refresh-token
 * Method: POST
 * Body: {refresh_token: string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

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

/**
 * Description. Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: {email_verify_token: string}
 */

usersRouter.post('/verify-email', verifyEmailTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description. Resend verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

// //**
// * Description. Resend verify email when user client click on the link in email
// * Path: /resend-verify-email
// * Method: POST
// * Header: { Authorization: Bearer <access_token> }
// * Body: {}
// */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

// //**
// * Description. Verify link in email to reset password
// * Path: /verify-forgot-password
// * Method: POST
// * Body: {forgot_password_token: string}
// */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

// //**
// * Description. Reset password
// * Path: /reset_password
// * Method: POST
// * Body: {forgot_password_token: string, password: string, confirm_password: string}
// */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

// //**
// * Description. Get information user
// * Path: /me
// * Method: GET
// * Header: { Authorization: Bearer <access_token> }
// */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

// //**
// * Description. Update information user
// * Path: /me
// * Method: PATCH
// * Header: { Authorization: Bearer <access_token> }
// * Body: UserSchema
// */
usersRouter.patch(
  '/update-me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

// //**
// * Description. Get profile user
// * Path: /:username
// * Method: GET
// */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

// //**
// * Description. Follow someone
// * Path: /follow
// * Method: POST
// * Header: { Authorization: Bearer <access_token> }
// * Body: {followed_user_id: string}
// */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

// //**
// * Description. UnFollow someone
// * Path: /follow/:user_id
// * Method: DELETE
// * Header: { Authorization: Bearer <access_token> }
// */

usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
