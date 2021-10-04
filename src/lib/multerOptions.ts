import { HttpException, HttpStatus } from '@nestjs/common'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { extname } from 'path'

const uuidRandom = (file: Express.Multer.File): string => {
  const uuidPath = `${uuidv4()}${extname(file.originalname)}`
  return uuidPath
}

export const createImageURL = (file: Express.Multer.File): string => {
  const serverAddress = 'http://localhost:4000'
  return `${serverAddress}/public/${file.filename}`
}

export const multerOptions = {
  fileFilter: (
    request: any,
    file: any,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true)
    } else {
      callback(
        new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'This is a custom message',
          },
          HttpStatus.FORBIDDEN,
        ),
        false,
      )
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath = 'public'

      if (!existsSync(uploadPath)) {
        // public 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(uploadPath)
      }

      callback(null, uploadPath)
    },

    filename: (request, file, callback) => {
      callback(null, uuidRandom(file))
    },
  }),
}
