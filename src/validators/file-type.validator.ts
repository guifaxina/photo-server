import { FileValidator } from '@nestjs/common';

export class MimeTypeValidator extends FileValidator<{ mimeTypes: string[] }> {
  protected validationOptions: { mimeTypes: string[]; message?: string };

  isValid(file?: Express.Multer.File | Express.Multer.File[]): boolean {
    if (!file) return false;

    const files = Array.isArray(file) ? file : [file];

    return files.some((f) =>
      this.validationOptions.mimeTypes.includes(f.mimetype),
    );
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return (
      this.validationOptions.message ??
      `${file.mimetype} é um tipo de arquivo inválido`
    );
  }
}
