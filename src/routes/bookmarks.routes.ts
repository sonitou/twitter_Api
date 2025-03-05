import { Router } from 'express'
import {
  bookmarkTweetController,
  getBookmarksController,
  unbookmarkTweetController
} from '~/controllers/bookmark.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouter = Router()
/**
 * Description: Create tweets
 * path /
 * Method: POST
 * Body: TweetRequestBody
 * Header: {Authorization: Bearer <access_token>}
 */
bookmarksRouter.post('', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

/**
 * Description: Get list tweets
 * path /
 * Method: Get
 * Header: {Authorization: Bearer <access_token>}
 */
bookmarksRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getBookmarksController))

/**
 * Description: UnBookmark tweets
 * path /tweets/:tweet_id
 * Method: DELETE
 * Body: TweetRequestBody
 * Header: {Authorization: Bearer <access_token>}
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unbookmarkTweetController)
)
export default bookmarksRouter
