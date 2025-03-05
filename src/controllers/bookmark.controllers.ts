import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'

import bookmarksService from '~/services/bookmarks.services'
import { BOOKMARK_MESSAGES } from '~/constants/messages'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.request'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarksService.bookmarkTweet(user_id, req.body.tweet_id)
  res.json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY,
    result
  })
}

export const getBookmarksController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as { user_id: string }

  // Gọi service để lấy danh sách bookmarks của user
  const bookmarks = await bookmarksService.getUserBookmarks(user_id)

  // Trả về response
  res.json({
    message: BOOKMARK_MESSAGES.GET_BOOKMARK_SUCCESSFULLY,
    bookmarks
  })
}
