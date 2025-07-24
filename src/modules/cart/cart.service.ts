import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthUser } from 'src/modules/users/types';
import { UsersService } from 'src/modules/users/users.service';
import { AddToCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getOrCreateCart(userAuth: AuthUser) {
    const user = await this.usersService.findByUuid(userAuth.sub);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    let cart = await this.prismaService.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            photo: {
              select: {
                uuid: true,
                url: true,
                description: true,
                photographer: { select: { name: true } },
                price: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              photo: {
                select: {
                  uuid: true,
                  url: true,
                  description: true,
                  photographer: { select: { name: true } },
                  price: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItemToCart(userAuth: AuthUser, addToCartDto: AddToCartDto) {
    const user = await this.usersService.findByUuid(userAuth.sub);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const photo = await this.prismaService.photo.findUnique({
      where: { uuid: addToCartDto.photoUuid },
    });

    if (!photo) {
      throw new NotFoundException('Foto não encontrada.');
    }

    if (photo.price.lessThanOrEqualTo(0)) {
      throw new BadRequestException(
        'Não é possível adicionar uma foto com preço zero ou negativo ao carrinho.',
      );
    }

    const cart = await this.getOrCreateCart(userAuth);

    const existingCartItem = await this.prismaService.cartItem.findFirst({
      where: {
        cartId: cart.id,
        photoId: photo.id,
      },
    });

    if (existingCartItem) {
      throw new BadRequestException('Esta foto já está no seu carrinho.');
    }

    const cartItem = await this.prismaService.cartItem.create({
      data: {
        cartId: cart.id,
        photoId: photo.id,
        priceAtAddition: photo.price,
      },
      include: {
        photo: {
          select: {
            uuid: true,
            url: true,
            description: true,
            photographer: { select: { name: true } },
            price: true,
          },
        },
      },
    });

    return cartItem;
  }

  async removeItemFromCart(userAuth: AuthUser, cartItemUuid: string) {
    const user = await this.usersService.findByUuid(userAuth.sub);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const cart = await this.getOrCreateCart(userAuth);

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { uuid: cartItemUuid },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Item do carrinho não encontrado.');
    }

    if (cartItem.cartId !== cart.id) {
      throw new BadRequestException('Este item não pertence ao seu carrinho.');
    }

    await this.prismaService.cartItem.delete({
      where: { uuid: cartItemUuid },
    });

    return { message: 'Item removido do carrinho com sucesso.' };
  }

  async clearCart(cartId: number) {
    await this.prismaService.cartItem.deleteMany({
      where: { cartId: cartId },
    });
    return { message: 'Carrinho limpo com sucesso.' };
  }
}
