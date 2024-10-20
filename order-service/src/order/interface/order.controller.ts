import { Body, Controller, Headers, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderCommand } from '../application/command/create-order.command';
import { AuthorizedHeader } from 'src/libs/auth';
import { CompleteOrderCommand } from '../application/command/complete-order.command';

@Controller('orders')
export class AccountsContoller {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    @Post()
    public async createOrder(@Body() dto: CreateOrderDto): Promise<void> {
        const command = new CreateOrderCommand(dto.customerId, dto.totalAmount);
        await this.commandBus.execute(command);
    }

    @Patch(':orderId')
    public async completeOrder(@Headers() header: AuthorizedHeader, @Param() param: string): Promise<void> {
        const command = new CompleteOrderCommand(param);
        await this.commandBus.execute(command);
    }
}
