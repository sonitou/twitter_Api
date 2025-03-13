import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/Search.request'
import searchService from '~/services/search.services'
export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await searchService.search({
    limit,
    page,
    content: req.query.content,
    user_id: req.decoded_authorization?.user_id as string,
    media_type: req.query.media_type
  })
  res.json({
    message: 'Search Successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
