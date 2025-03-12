import { TweetRequestBody } from '~/models/requests/Tweet.request'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Tweet from '~/models/schemas/Tweet.schemas'
import Hashtag from '~/models/schemas/Hashtag.schemas'
import { TweetType } from '~/constants/enums'
import { update } from 'lodash'

class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagsDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // Tìm hashtag trong database, nếu có thì lấy, không thì tạo mới
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagsDocuments.map((hashtag) => (hashtag as WithId<Hashtag>)._id)
  }
  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_views: 1,
          user_views: 1,
          update_at: 1
        }
      }
    )
    return result as WithId<{
      guest_views: number
      user_views: number
      updated_at: Date
    }>
  }
  async getTweetChildren({
    tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  }: {
    tweet_id: string
    tweet_type: TweetType
    limit: number
    page: number
    user_id?: string
  }) {
    const tweets = await databaseService.tweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),
            type: tweet_type
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mention',
                in: {
                  _id: '$$mention._id',
                  name: '$$mention.name',
                  username: '$$mention.username',
                  email: '$$mention.email'
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'tweet_children'
          }
        },
        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },
            likes: {
              $size: '$likes'
            },
            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', TweetType.Retweet]
                  }
                }
              }
            },
            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', TweetType.Comment]
                  }
                }
              }
            },
            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', TweetType.QuoteTweet]
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            tweet_children: 0
          }
        },
        {
          $skip: limit * (page - 1) // Công thức phân trang
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const ids = tweets.map((tweet) => tweet._id as ObjectId)
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const date = new Date()

    const [, total] = await Promise.all([
      databaseService.tweets.updateMany(
        {
          _id: {
            $in: ids
          }
        },
        {
          $inc: inc,
          $set: {
            updated_at: date
          }
        }
      ),
      databaseService.tweets.countDocuments({
        parent_id: new ObjectId(tweet_id),
        type: tweet_type
      })
    ])

    tweets.forEach((tweet) => {
      tweet.updated_at = date
      if (user_id) {
        tweet.user_views += 1
      } else {
        tweet.guest_views += 1
      }
    })
    return {
      tweets,
      total
    }
  }
  async getNewFeeds({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const user_id_obj = new ObjectId(user_id)

    //  Lấy danh sách user mà user hiện tại đang follow
    const followed_user_ids = await databaseService.followers
      .find({ user_id: user_id_obj }, { projection: { followed_user_id: 1 } })
      .toArray()
    const ids = followed_user_ids.map((item) => item.followed_user_id)

    // Thêm chính user_id vào để lấy cả tweet của mình
    ids.push(user_id_obj)

    // Query danh sách tweet và tổng số tweet đồng thời
    const [tweets, total] = await Promise.all([
      databaseService.tweets
        .aggregate([
          { $match: { user_id: { $in: ids } } },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user',
              pipeline: [{ $project: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }]
            }
          },
          { $unwind: '$user' },
          {
            $match: {
              $or: [
                { audience: 0 }, // Public
                { audience: 1, 'user.twitter_circle': { $in: [user_id_obj] } } // Twitter Circle
              ]
            }
          },
          { $sort: { created_at: -1 } }, // Sắp xếp theo thời gian mới nhất
          { $skip: limit * (page - 1) },
          { $limit: limit },
          {
            $lookup: {
              from: 'hashtags',
              localField: 'hashtags',
              foreignField: '_id',
              as: 'hashtags',
              pipeline: [{ $project: { _id: 1, name: 1 } }]
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'mentions',
              foreignField: '_id',
              as: 'mentions',
              pipeline: [{ $project: { _id: 1, name: 1, username: 1, email: 1 } }]
            }
          },
          {
            $lookup: {
              from: 'bookmarks',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'likes'
            }
          },
          {
            $lookup: {
              from: 'tweets',
              localField: '_id',
              foreignField: 'parent_id',
              as: 'tweet_children'
            }
          },
          {
            $addFields: {
              bookmarks: { $size: '$bookmarks' },
              likes: { $size: '$likes' },
              retweet_count: {
                $size: {
                  $filter: { input: '$tweet_children', as: 'item', cond: { $eq: ['$$item.type', TweetType.Retweet] } }
                }
              },
              comment_count: {
                $size: {
                  $filter: { input: '$tweet_children', as: 'item', cond: { $eq: ['$$item.type', TweetType.Comment] } }
                }
              },
              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: { $eq: ['$$item.type', TweetType.QuoteTweet] }
                  }
                }
              }
            }
          },
          { $project: { tweet_children: 0 } }
        ])
        .toArray(),

      // Tối ưu đếm tổng số tweet
      databaseService.tweets.countDocuments({ user_id: { $in: ids } })
    ])

    // Tối ưu cập nhật lượt xem bằng bulkWrite
    const tweet_ids = tweets.map((tweet) => tweet._id)
    const date = new Date()

    if (tweet_ids.length > 0) {
      await databaseService.tweets.bulkWrite(
        tweet_ids.map((id) => ({
          updateOne: {
            filter: { _id: id },
            update: { $inc: { user_views: 1 }, $set: { updated_at: date } }
          }
        }))
      )

      tweets.forEach((tweet) => {
        tweet.updated_at = date
        tweet.user_views += 1
      })
    }

    return { tweets, total }
  }
}

const tweetsService = new TweetsService()
export default tweetsService
