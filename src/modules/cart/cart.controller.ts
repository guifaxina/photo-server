import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthUser } from 'src/modules/users/types';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { z } from 'zod';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/cart.dto';

const addToCartSchema = z.object({
  photoUuid: z.string().uuid('O UUID da foto deve ser válido.'),
});

const removeFromCartSchema = z.object({
  cartItemUuid: z.string().uuid('O UUID do item do carrinho deve ser válido.'),
});

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: AuthUser) {
    return this.cartService.getOrCreateCart(user);
  }

  @Post('add')
  async addItem(
    @CurrentUser() user: AuthUser,
    @Body(new ZodPipe(addToCartSchema)) addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addItemToCart(user, addToCartDto);
  }

  @Delete('remove/:cartItemUuid')
  async removeItem(
    @CurrentUser() user: AuthUser,
    @Param('cartItemUuid', new ZodPipe(removeFromCartSchema.shape.cartItemUuid))
    cartItemUuid: string,
  ) {
    return this.cartService.removeItemFromCart(user, cartItemUuid);
  }
}
