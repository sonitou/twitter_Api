import { ObjectId, WithId } from 'mongodb'
import Bookmark from '~/models/schemas/Bookmark.schemas'
import databaseService from './database.services'

class BookmarksService {
  async bookmarkTweet(user_id: string, tweetId: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweetId)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweetId)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result as WithId<Bookmark>
  }
  // Lấy danh sách bookmarks của user
  async getUserBookmarks(user_id: string) {
    const bookmarks = await databaseService.bookmarks
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } }, // Lọc theo user_id
        {
          $lookup: {
            from: 'tweets', // Join với collection tweets
            localField: 'tweet_id',
            foreignField: '_id',
            as: 'tweet'
          }
        },
        { $unwind: '$tweet' }, // Chuyển mảng tweet thành object
        { $sort: { created_at: -1 } }, // Sắp xếp theo thời gian
        {
          $project: {
            _id: 1,
            created_at: 1,
            tweet: {
              _id: 1,
              content: 1,
              user_id: 1,
              created_at: 1
            }
          }
        }
      ])
      .toArray()

    return bookmarks
  }
}

const bookmarksService = new BookmarksService()
export default bookmarksService
