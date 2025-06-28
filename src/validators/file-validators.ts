import { MaxFileSizeValidator } from '@nestjs/common';
import { MimeTypeValidator } from './file-type.validator';

export const fileValidators = [
  new MaxFileSizeValidator({
    maxSize: 1024 * 1024 * 250,
    message: 'O arquivo ultrapassa o máximo de 250MB',
  }),
  new MimeTypeValidator({
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  }),
];
