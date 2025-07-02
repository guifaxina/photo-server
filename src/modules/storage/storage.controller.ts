import {
  BadRequestException,
  Controller,
  Get,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { StorageService } from './storage.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileValidators } from 'src/validators/file-validators';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthUser } from '../users/types';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums/user-type.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('list')
  async list() {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files' },
      { name: 'fileMain', maxCount: 1 },
    ]),
  )
  @Post('upload')
  @Roles(UserRole.PHOTOGRAPHER)
  async upload(
    @CurrentUser() user: AuthUser,
    @UploadedFiles()
    {
      files,
      fileMain,
    }: { files: Express.Multer.File[]; fileMain: Express.Multer.File[] },
  ) {
    const filesPipe = new ParseFilePipe({ validators: fileValidators });

    for (const file of [...files, ...fileMain]) {
      try {
        await filesPipe.transform(file);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    return await this.storageService.upload(
      [
        ...files.map((file) => ({ file, isMain: false })),
        ...fileMain.map((file) => ({ file, isMain: true })),
      ],
      user,
    );
  }
}
