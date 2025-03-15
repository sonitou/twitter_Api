import { checkSchema } from 'express-validator'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enums'
import { SEARCH_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema({
    content: {
      trim: true,
      notEmpty: {
        errorMessage: SEARCH_MESSAGES.SEARCH_CONTENT_IS_REQUIRED
      },
      isString: {
        errorMessage: SEARCH_MESSAGES.SEARCH_CONTENT_MUST_BE_STRING
      },
      isLength: {
        options: { max: 255 },
        errorMessage: SEARCH_MESSAGES.SEARCH_CONTENT_LENGTH_MUST_BE_LESS_THAN_255
      }
    },
    media_type: {
      optional: true,
      isIn: {
        options: [Object.values(MediaTypeQuery)],
        errorMessage: SEARCH_MESSAGES.SEARCH_MEDIA_TYPE_MUST_BE_ONE_OF + `${Object.values(MediaTypeQuery).join(', ')}`
      }
    },
    people_follow: {
      optional: true,
      isIn: {
        options: [Object.values(PeopleFollow)],
        errorMessage: SEARCH_MESSAGES.SEARCH_PEOPLE_FOLLOW_MUST_BE_0_OR_1
      }
    }
  })
)
