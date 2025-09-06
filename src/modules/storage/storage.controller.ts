import {
  BadRequestException,
  Body,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileValidators } from 'src/validators/file-validators';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthUser } from '../users/types';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums/user-type.enum';
import { UploadPhotoDto, uploadPhotoSchema } from './dto/upload-photo.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';

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
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body(new ZodPipe(uploadPhotoSchema))
    uploadPhotoDto: UploadPhotoDto,
  ) {
    const filesPipe = new ParseFilePipe({ validators: fileValidators });

    for (const file of files) {
      try {
        await filesPipe.transform(file);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    if (files.length !== uploadPhotoDto.prices.length) {
      throw new BadRequestException(
        'Número de arquivos não corresponde ao número de preços.',
      );
    }

    const dataToUpload = files.map((file, i) => {
      return {
        file,
        price: uploadPhotoDto.prices[i],
      };
    });

    return await this.storageService.upload(dataToUpload, user);
  }
}
