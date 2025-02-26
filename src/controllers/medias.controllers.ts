import { NextFunction, Request, Response } from 'express'
import { handleUploadSingleImage } from '~/constants/file'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req)
  const data = await handleUploadSingleImage(req)
  res.json({
    result: data
  })
}
