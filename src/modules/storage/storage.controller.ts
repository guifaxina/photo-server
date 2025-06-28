import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { StorageService } from './storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
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

  @UseInterceptors(FilesInterceptor('files'))
  @Post('upload')
  @Roles(UserRole.PHOTOGRAPHER)
  async upload(
    @CurrentUser() user: AuthUser,
    @UploadedFiles(
      new ParseFilePipe({
        validators: fileValidators,
      }),
    )
    files: Express.Multer.File[],
  ) {
    return await this.storageService.upload(files, user);
  }
}
