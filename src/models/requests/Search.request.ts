import { Pagination } from './Tweet.request'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enums'
import { Query } from 'express-serve-static-core'

export interface SearchQuery extends Pagination, Query {
  content: string
  media_type?: MediaTypeQuery
  people_follow?: PeopleFollow
}
