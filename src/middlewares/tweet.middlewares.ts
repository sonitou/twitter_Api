import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'

const tweetType = numberEnumToArray(TweetType)
const tweetAudience = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema({
    type: {
      in: ['body'],
      isIn: {
        options: [tweetType],
        errorMessage: TWEETS_MESSAGES.INVALID_TYPE
      }
    },
    audience: {
      in: ['body'],
      isIn: {
        options: [tweetAudience],
        errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
      }
    },
    parent_id: {
      in: ['body'],
      optional: true,
      custom: {
        options: async (value, { req }) => {
          if (value && !ObjectId.isValid(value)) {
            throw new ErrorWithStatus({ message: TWEETS_MESSAGES.INVALID_PARENT_ID, status: HTTP_STATUS.BAD_REQUEST })
          }
          const type = req.body.type as TweetType
          // nếu `type` là tweet thì `parent_id` phải là `null`
          if (type === TweetType.Tweet && value !== null) {
            throw new ErrorWithStatus({
              message: TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          if ([TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]
          // Nếu `type` là comment, quotetweet, tweet và không có `mentions` và `hashtags` thì `content` phải là string và không được rỗng
          if (
            [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            value === ''
          ) {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
          }
          // Nếu `type` là retweet thì `content` phải là `''`.
          if (type === TweetType.Retweet && value !== '') {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong array là string
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần từ trong array là user_id
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần từ trong array là Media Object
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
          ) {
            throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)
