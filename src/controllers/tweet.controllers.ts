import { Request, Response } from 'express'
import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '~/models/requests/Tweet.request'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetsService from '~/services/tweets.services'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetType } from '~/constants/enums'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  })
}

export const getTweetController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    user_views: result.user_views,
    updated_at: result.updated_at
  }
  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}

export const getTweetChildrendController = async (req: Request, res: Response) => {
  const tweet_type = Number(req.query.tweet_type as string) as TweetType
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const user_id = req.decoded_authorization?.user_id
  const { total, tweets } = await tweetsService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFULLY,
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await tweetsService.getNewFeeds({ user_id, limit, page })
  res.json({
    message: TWEETS_MESSAGES.GET_NEW_FEEDS_SUCCESSFULLY,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
