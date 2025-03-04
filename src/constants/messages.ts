export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác thực',
  NAME_IS_REQUIRED: 'Tên là bắt buộc',
  NAME_MUST_BE_STRING: 'Tên phải là một chuỗi',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên phải có độ dài từ 1 đến 100 ký tự',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  EMAIL_IS_REQUIRED: 'Email là bắt buộc',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Mật khẩu phải có độ dài từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải mạnh (chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuỗi',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Xác nhận mật khẩu phải có độ dài từ 6 đến 50 ký tự',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Xác nhận mật khẩu phải mạnh (chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)',
  CONFIRM_PASSWORD_IS_NOT_MATCH: 'Xác nhận mật khẩu không khớp',
  DATA_OF_BIRTH_MUST_ISO8601: 'Ngày sinh phải theo chuẩn ISO8601',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token là bắt buộc',
  USERS_REFRESH_TOKEN_OR_NOT_EXISTS: 'Refresh token không tồn tại hoặc đã hết hạn',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token là bắt buộc',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email đã được xác minh trước đó',
  EMAIL_VERIFY_SUCCESS: 'Xác minh email thành công',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Gửi lại email xác minh thành công',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Kiểm tra email để đặt lại mật khẩu',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Quên mật khẩu token là bắt buộc',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Quên mật khẩu token không hợp lệ',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác minh quên mật khẩu thành công',
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',
  GET_USER_SUCCESS: 'Tài khoản đã được lấy thành công',
  USER_NOT_VERIFIED: 'Người dùng chưa xác thực',
  BIO_MUST_BE_STRING: 'Giá trị BIO phải là một chuỗi',
  BIO_LENGTH: 'BIO phải có độ dài từ 1 đến 200 ký tự',
  LOCATION_MUST_BE_STRING: 'Vị trí phải là một chuỗi',
  LOCATION_LENGTH: 'Vị trí có độ dài từ 1 đên 50 ký tự',
  WEBSITE_MUST_BE_STRING: 'Giá trị WEBSITE phải là một chuỗi',
  WEBSITE_LENGTH: 'WEBSITE có độ dài từ 1 đến 200 ký tự',
  USERNAME_MUST_BE_STRING: 'Họ và tên phải là một chuỗi',
  USERNAME_LENGTH: 'Họ và tên có độ dài từ 1 đến 50 ký tự',
  IMAGE_URL_MUST_BE_STRING: 'Giá trị IMAGE_URL phải là một chuỗi',
  IMAGE_URL_LENGTH: 'IMAGE_URL có độ dài từ 1 đến 400 ký tự',
  UPDATE_ME_SUCCESS: 'Cập nhật thông tin thành công',
  GET_PROFILE_SUCCESS: 'Lấy thông tin hồ sơ thành công',
  FOLLOW_SUCCESS: 'Theo dõi thành công',
  INVALID_FOLLOWED_USER_ID: 'id người dùng theo dõi không hợp lệ',
  FOLLOWED: 'Đã theo dõi ',
  UNFOLLOW_SUCCESS: 'Bỏ theo dõi thành công',
  NOT_FOLLOWING: 'Chưa theo dõi ',
  INVALID_USER_ID: 'ID người dùng không hợp lệ',
  USERNAME_INVALID: 'Tên người dùng không hợp lệ',
  USERNAME_EXISTED: 'Tên người dùng đã tồn tại',
  OLD_PASSWORD_NOT_MATCH: 'Mật khẩu cũ không khớp',
  PASSWORD_CHANGE_SUCCESS: 'Đổi mật khẩu thành công',
  UPLOAD_SUCCESS: 'Tải lên thành công',
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công'
} as const

export const TWEETS_MESSAGES = {
  INVALID_TYPE: 'Type không hợp lệ',
  INVALID_AUDIENCE: 'Audience không hợp lệ',
  INVALID_PARENT_ID: 'Parent ID không hợp lệ',
  PARENT_ID_MUST_BE_NULL: 'Parent ID phải là null',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent ID phải là một ID tweet hợp lệ',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Nội dung phải là một chuỗi không rỗng',
  CONTENT_MUST_BE_EMPTY_STRING: 'Nội dung phải là một chuỗi rỗng',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags phải là một mảng chuỗi',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions phải là một mảng ID người dùng',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias phải là một mảng đối tượng media',
  CREATE_TWEET_SUCCESS: 'Tạo Tweet thành công '
} as const

export const BOOKMARK_MESSAGES = {
  BOOKMARK_SUCCESSFULLY: 'Bookmark thành công'
}
