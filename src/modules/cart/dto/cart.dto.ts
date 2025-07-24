import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsUUID('4', { message: 'O UUID da foto deve ser válido.' })
  @IsNotEmpty({ message: 'O UUID da foto não pode ser vazio.' })
  photoUuid: string;
}

export class RemoveFromCartDto {
  @IsUUID('4', { message: 'O UUID do item do carrinho deve ser válido.' })
  @IsNotEmpty({ message: 'O UUID do item do carrinho não pode ser vazio.' })
  cartItemUuid: string;
}
