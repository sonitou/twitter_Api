import { Pagination } from './Tweet.request'
import { MediaTypeQuery } from '~/constants/enums'

export interface SearchQuery extends Pagination {
  content: string
  media_type: MediaTypeQuery
}
