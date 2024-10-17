import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';
import { ManyToOne } from 'typeorm';
import { OrderCommand } from '../order-command.entity';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '0,2' })
  price: number;

  @IsNotEmpty()
  quantity: number;

  @ManyToOne(() => OrderCommand, (orderCommand) => orderCommand.items)
  orderCommand: OrderCommand;
}
