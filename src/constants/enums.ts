export enum UserVerifyStatus {
  Unverified,
  verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum MediaType {
  Image,
  Video
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}

export enum TweetType {
  Tweet, // 0 - Tweet bình thường
  Retweet, // 1 - Retweet (chia sẻ lại tweet của người khác)
  Comment, // 2 - Bình luận (trả lời một tweet)
  QuoteTweet // 3 - Trích dẫn tweet (retweet kèm nội dung)
}
