import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '0,2' })
  price: number;

  @IsNotEmpty()
  quantity: number;
}
