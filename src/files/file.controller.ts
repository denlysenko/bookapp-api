import {
  BadRequestException,
  Controller,
  Delete,
  FileInterceptor,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as path from 'path';
import * as uuidv4 from 'uuidv4';

import { FILE_ERRORS } from '../constants';
import { FileService } from './file.service';

function fileFilter(req, file, cb) {
  if (
    !file.mimetype.includes('jpeg') &&
    !file.mimetype.includes('png') &&
    !file.mimetype.includes('epub')
  ) {
    return cb(null, false);
  }
  cb(null, true);
}

const options = { fileFilter, limits: { fileSize: 10000000 } };

@Controller('api/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', options))
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException(FILE_ERRORS.INVALID_MIMETYPE_ERR);
    }
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    return await this.fileService.uploadToS3(file.buffer, filename);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteFile(@Param('id') key: string) {
    return await this.fileService.deleteFromS3(key);
  }
}
