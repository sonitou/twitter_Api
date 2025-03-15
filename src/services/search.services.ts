import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { MediaType, MediaTypeQuery, TweetType } from '~/constants/enums'

class SearchService {
  //   async search({
  //     limit,
  //     page,
  //     content,
  //     user_id,
  //     media_type
  //   }: {
  //     limit: number
  //     page: number
  //     content: string
  //     user_id: string
  //     media_type: MediaTypeQuery
  //   }) {
  //     const userObjectId = new ObjectId(user_id)

  //     // Điều kiện lọc tweet dựa vào audience & quyền truy cập
  //     const matchCondition = {
  //       $match: {
  //         $text: { $search: content },
  //         $or: [{ audience: 0 }, { $and: [{ audience: 1 }, { 'user.twitter_circle': { $in: [userObjectId] } }] }]
  //       }
  //     }

  //     // Các bước xử lý chung cho tweet
  //     const tweetPipeline = [
  //       matchCondition,
  //       {
  //         $lookup: {
  //           from: 'users',
  //           localField: 'user_id',
  //           foreignField: '_id',
  //           as: 'user'
  //         }
  //       },
  //       { $unwind: '$user' },
  //       {
  //         $lookup: { from: 'hashtags', localField: 'hashtags', foreignField: '_id', as: 'hashtags' }
  //       },
  //       {
  //         $lookup: { from: 'users', localField: 'mentions', foreignField: '_id', as: 'mentions' }
  //       },
  //       {
  //         $addFields: {
  //           mentions: {
  //             $map: {
  //               input: '$mentions',
  //               as: 'mention',
  //               in: {
  //                 _id: '$$mention._id',
  //                 name: '$$mention.name',
  //                 username: '$$mention.username',
  //                 email: '$$mention.email'
  //               }
  //             }
  //           }
  //         }
  //       },
  //       {
  //         $lookup: { from: 'bookmarks', localField: '_id', foreignField: 'tweet_id', as: 'bookmarks' }
  //       },
  //       {
  //         $lookup: { from: 'likes', localField: '_id', foreignField: 'tweet_id', as: 'likes' }
  //       },
  //       {
  //         $lookup: { from: 'tweets', localField: '_id', foreignField: 'parent_id', as: 'tweet_children' }
  //       },
  //       {
  //         $addFields: {
  //           bookmarks: { $size: '$bookmarks' },
  //           likes: { $size: '$likes' },
  //           retweet_count: {
  //             $size: {
  //               $filter: {
  //                 input: '$tweet_children',
  //                 as: 'item',
  //                 cond: { $eq: ['$$item.type', TweetType.Retweet] }
  //               }
  //             }
  //           },
  //           comment_count: {
  //             $size: {
  //               $filter: {
  //                 input: '$tweet_children',
  //                 as: 'item',
  //                 cond: { $eq: ['$$item.type', TweetType.Comment] }
  //               }
  //             }
  //           },
  //           quote_count: {
  //             $size: {
  //               $filter: {
  //                 input: '$tweet_children',
  //                 as: 'item',
  //                 cond: { $eq: ['$$item.type', TweetType.QuoteTweet] }
  //               }
  //             }
  //           }
  //         }
  //       },
  //       {
  //         $project: {
  //           tweet_children: 0,
  //           'user.password': 0,
  //           'user.forgot_password_token': 0,
  //           'user.email_verify_token': 0,
  //           'user.twitter_circle': 0,
  //           'user.date_of_birth': 0
  //         }
  //       },
  //       { $skip: limit * (page - 1) },
  //       { $limit: limit }
  //     ]

  //     // Pipeline để đếm số lượng tweet
  //     const countPipeline = [matchCondition, { $count: 'total' }]

  //     const [tweets, totalCount] = await Promise.all([
  //       databaseService.tweets.aggregate(tweetPipeline).toArray(),
  //       databaseService.tweets.aggregate(countPipeline).toArray()
  //     ])

  //     // Đảm bảo total không bị undefined
  //     const total = totalCount.length > 0 ? totalCount[0].total : 0

  //     const tweetIds = tweets.map((tweet) => tweet._id as ObjectId)
  //     const date = new Date()

  //     // Cập nhật lượt xem & thời gian cập nhật
  //     if (tweetIds.length > 0) {
  //       await databaseService.tweets.updateMany(
  //         { _id: { $in: tweetIds } },
  //         { $inc: { user_views: 1 }, $set: { updated_at: date } }
  //       )
  //     }

  //     tweets.forEach((tweet) => {
  //       tweet.updated_at = date
  //       tweet.user_views = (tweet.user_views || 0) + 1
  //     })

  //     return { tweets, total }
  //   }
  // }
  // async search({
  //   limit,
  //   page,
  //   content,
  //   user_id,
  //   media_type,
  //   people_follow
  // }: {
  //   limit: number
  //   page: number
  //   content: string
  //   user_id: string
  //   media_type?: MediaTypeQuery // Thêm media_type vào params
  //   people_follow?: string
  // }) {
  //   const userObjectId = new ObjectId(user_id)

  //   // Điều kiện lọc tweet dựa vào audience & quyền truy cập
  //   const matchCondition: any = {
  //     $text: { $search: content },
  //     $or: [{ audience: 0 }, { $and: [{ audience: 1 }, { 'user.twitter_circle': { $in: [userObjectId] } }] }]
  //   }

  //   // Thêm điều kiện lọc theo media_type nếu có
  //   if (media_type) {
  //     if (media_type === MediaTypeQuery.Image) {
  //       matchCondition['medias.type'] = MediaType.Image
  //     } else if (media_type === MediaTypeQuery.Video) {
  //       matchCondition['medias.type'] = { $in: [MediaType.Video] }
  //     }
  //   }

  //   if (people_follow && people_follow === '1') {
  //     // const user_id_obj = new ObjectId(user_id)
  //     const followed_id_ids = await databaseService.followers
  //       .find(
  //         { user_id: userObjectId },
  //         {
  //           projection: {
  //             followed_user_id: 1,
  //             _id: 0
  //           }
  //         }
  //       )
  //       .toArray()
  //     const ids = followed_id_ids.map((item) => item.followed_user_id)
  //     ids.push(userObjectId)
  //     matchCondition['user_id'] = {
  //       $in: ids
  //     }
  //   }

  //   // Các bước xử lý chung cho tweet
  //   const tweetPipeline = [
  //     { $match: matchCondition },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'user_id',
  //         foreignField: '_id',
  //         as: 'user'
  //       }
  //     },
  //     { $unwind: '$user' },
  //     {
  //       $lookup: { from: 'hashtags', localField: 'hashtags', foreignField: '_id', as: 'hashtags' }
  //     },
  //     {
  //       $lookup: { from: 'users', localField: 'mentions', foreignField: '_id', as: 'mentions' }
  //     },
  //     {
  //       $addFields: {
  //         mentions: {
  //           $map: {
  //             input: '$mentions',
  //             as: 'mention',
  //             in: {
  //               _id: '$$mention._id',
  //               name: '$$mention.name',
  //               username: '$$mention.username',
  //               email: '$$mention.email'
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       $lookup: { from: 'bookmarks', localField: '_id', foreignField: 'tweet_id', as: 'bookmarks' }
  //     },
  //     {
  //       $lookup: { from: 'likes', localField: '_id', foreignField: 'tweet_id', as: 'likes' }
  //     },
  //     {
  //       $lookup: { from: 'tweets', localField: '_id', foreignField: 'parent_id', as: 'tweet_children' }
  //     },
  //     {
  //       $addFields: {
  //         bookmarks: { $size: '$bookmarks' },
  //         likes: { $size: '$likes' },
  //         retweet_count: {
  //           $size: {
  //             $filter: {
  //               input: '$tweet_children',
  //               as: 'item',
  //               cond: { $eq: ['$$item.type', TweetType.Retweet] }
  //             }
  //           }
  //         },
  //         comment_count: {
  //           $size: {
  //             $filter: {
  //               input: '$tweet_children',
  //               as: 'item',
  //               cond: { $eq: ['$$item.type', TweetType.Comment] }
  //             }
  //           }
  //         },
  //         quote_count: {
  //           $size: {
  //             $filter: {
  //               input: '$tweet_children',
  //               as: 'item',
  //               cond: { $eq: ['$$item.type', TweetType.QuoteTweet] }
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       $project: {
  //         tweet_children: 0,
  //         'user.password': 0,
  //         'user.forgot_password_token': 0,
  //         'user.email_verify_token': 0,
  //         'user.twitter_circle': 0,
  //         'user.date_of_birth': 0
  //       }
  //     },
  //     { $skip: limit * (page - 1) },
  //     { $limit: limit }
  //   ]

  //   // Pipeline để đếm số lượng tweet
  //   const countPipeline = [{ $match: matchCondition }, { $count: 'total' }]

  //   const [tweets, totalCount] = await Promise.all([
  //     databaseService.tweets.aggregate(tweetPipeline).toArray(),
  //     databaseService.tweets.aggregate(countPipeline).toArray()
  //   ])

  //   // Đảm bảo total không bị undefined
  //   const total = totalCount.length > 0 ? totalCount[0].total : 0

  //   const tweetIds = tweets.map((tweet) => tweet._id as ObjectId)
  //   const date = new Date()

  //   // Cập nhật lượt xem & thời gian cập nhật
  //   if (tweetIds.length > 0) {
  //     await databaseService.tweets.updateMany(
  //       { _id: { $in: tweetIds } },
  //       { $inc: { user_views: 1 }, $set: { updated_at: date } }
  //     )
  //   }

  //   tweets.forEach((tweet) => {
  //     tweet.updated_at = date
  //     tweet.user_views = (tweet.user_views || 0) + 1
  //   })

  //   return { tweets, total }
  // }
  async search({
    limit,
    page,
    content,
    user_id,
    media_type,
    people_follow
  }: {
    limit: number
    page: number
    content: string
    user_id: string
    media_type?: MediaTypeQuery
    people_follow?: string
  }) {
    const userObjectId = new ObjectId(user_id)

    // Điều kiện lọc tweet dựa vào quyền truy cập
    const matchCondition: any = {
      $text: { $search: content },
      $or: [
        { audience: 0 }, // Công khai
        { audience: 1, 'user.twitter_circle': userObjectId } // Circle Tweet
      ]
    }

    // Lọc theo media_type nếu có
    if (media_type) {
      matchCondition['medias.type'] = media_type === MediaTypeQuery.Image ? MediaType.Image : { $in: [MediaType.Video] }
    }

    // Lọc tweet của người dùng đang follow nếu `people_follow === '1'`
    if (people_follow === '1') {
      const followedUsers = await databaseService.followers
        .aggregate([{ $match: { user_id: userObjectId } }, { $project: { _id: 0, followed_user_id: 1 } }])
        .toArray()
      const followedIds = followedUsers.map((item) => item.followed_user_id)

      matchCondition['user_id'] = { $in: [...followedIds, userObjectId] }
    }

    // Pipeline xử lý tweet
    const tweetPipeline = [
      { $match: matchCondition },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { password: 0, forgot_password_token: 0, email_verify_token: 0 } }]
        }
      },
      { $unwind: '$user' },
      { $lookup: { from: 'hashtags', localField: 'hashtags', foreignField: '_id', as: 'hashtags' } },
      {
        $lookup: {
          from: 'users',
          localField: 'mentions',
          foreignField: '_id',
          as: 'mentions',
          pipeline: [{ $project: { _id: 1, name: 1, username: 1, email: 1 } }]
        }
      },
      { $lookup: { from: 'bookmarks', localField: '_id', foreignField: 'tweet_id', as: 'bookmarks' } },
      { $lookup: { from: 'likes', localField: '_id', foreignField: 'tweet_id', as: 'likes' } },
      { $lookup: { from: 'tweets', localField: '_id', foreignField: 'parent_id', as: 'tweet_children' } },
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
          },
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
              $filter: { input: '$tweet_children', as: 'item', cond: { $eq: ['$$item.type', TweetType.QuoteTweet] } }
            }
          }
        }
      },
      { $project: { tweet_children: 0, 'user.twitter_circle': 0, 'user.date_of_birth': 0 } },
      { $skip: limit * (page - 1) },
      { $limit: limit }
    ]

    // Pipeline để đếm số lượng tweet
    const countPipeline = [{ $match: matchCondition }, { $count: 'total' }]

    // Chạy truy vấn đồng thời
    const [tweets, totalCount] = await Promise.all([
      databaseService.tweets.aggregate(tweetPipeline).toArray(),
      databaseService.tweets.aggregate(countPipeline).toArray()
    ])

    const total = totalCount.length > 0 ? totalCount[0].total : 0
    const tweetIds = tweets.map((tweet) => tweet._id as ObjectId)
    const date = new Date()

    // Cập nhật lượt xem và thời gian cập nhật
    if (tweetIds.length > 0) {
      await databaseService.tweets.updateMany(
        { _id: { $in: tweetIds } },
        { $inc: { user_views: 1 }, $set: { updated_at: date } }
      )
    }

    tweets.forEach((tweet) => {
      tweet.updated_at = date
      tweet.user_views = (tweet.user_views || 0) + 1
    })

    return { tweets, total }
  }
}

const searchService = new SearchService()

export default searchService
