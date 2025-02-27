import { NextFunction, Request, Response } from 'express'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import HTTP_STATUS from '~/constants/httpStatus'
import path from 'path'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
    return
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // 1MB = 10^6 bytes (Tính theo hệ 10, đây là thứ mà chúng ta hay thấy trên UI)
  // Còn nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes (1024 * 1024)

  // Kiểm tra nếu video không tồn tại
  if (!fs.existsSync(videoPath)) {
    res.status(HTTP_STATUS.NOT_FOUND).send('Video not found')
    return
  }

  // Lấy thông tin video
  // Dung lượng video (bytes)
  const videoSize = fs.statSync(videoPath).size
  // DUng lượng video cho mỗi phân đoạn stream
  const chunkSize = 10 ** 6 // 1MB

  // Lấy giá trị byte bắt đầu từ header Range (vd: bytes=1048576-)
  const parts = range.replace(/bytes=/, '').split('-')
  // const start = Number((range as string).replace(/\D/g, ''))
  const start = parseInt(parts[0], 10)
  // Lấy giá trị byte kết thúc, vượt quá dung lượng video thì lấy giá trị videoSize
  // const end = Math.min(start + chunkSize, videoSize - 1)
  const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + chunkSize, videoSize - 1)

  // Đảm bảo `start` và `end` hợp lệ
  if (start >= videoSize || end >= videoSize || start > end) {
    res.status(HTTP_STATUS.RANGE_NOT_SATISFIABLE).send('Invalid range')
    return
  }

  // Dung lượng thực tế cho mỗi đoạn video stream
  // Thường đây sẽ là chunkSize, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  const mime = (await import('mime')).default
  const contentType = mime.getType(videoPath) || 'video/*'
  // Gửi header phản hồi
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  })
  // const headers = {
  //   'Content-Range': `bytes ${start}-${end}/${videoSize}`,
  //   'Accept-Ranges': 'bytes',
  //   'Content-Length': contentLength,
  //   'Content-Type': contentType
  // }
  // res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoSteams = fs.createReadStream(videoPath, { start, end })
  videoSteams.pipe(res)
}
