import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { z } from 'zod'; // Importar Zod para validação

export class UploadPhotoDto {
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @Transform(({ value }) => {
    return Array.isArray(value) ? value.map((v) => Number(v)) : [Number(value)];
  })
  @IsNumber({}, { each: true, message: 'O preço deve ser um número.' })
  @Min(0, { each: true, message: 'O preço não pode ser negativo.' })
  prices: number[];
}

export const uploadPhotoSchema = z.object({
  description: z.string().optional(),
  prices: z.array(z.coerce.number().min(0, 'O preço não pode ser negativo.')),
});
