import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { z } from 'zod'; // Importar Zod para validação

export class UploadPhotoDto {
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  @Type(() => Number)
  price: number;
}

export const uploadPhotoSchema = z.object({
  description: z.string().optional(),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, 'O preço não pode ser negativo.'),
  ),
});
