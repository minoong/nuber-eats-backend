import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { createImageURL, multerOptions } from 'src/lib/multerOptions'

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = createImageURL(file)

    return {
      url,
    }
  }
}
