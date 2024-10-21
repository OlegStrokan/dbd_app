import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderCommand } from '../application/command/create-order.command';
import { AuthorizedHeader } from 'src/libs/auth';
import { CompleteOrderCommand } from '../application/command/complete-order.command';
import { CancelOrderCommand } from '../application/command/cancel-order.command';
import { ShipOrderDto } from './dto/ship-order.dto';
import { ShipOrderCommand } from '../application/command/ship-order.command';
import { FindOrdersQuery } from '../application/query/find-orders.query';
import { FindOrdersResponseDto } from './response-dto/find-orders-response.dto';
import { FindOrderByIdResponseDto } from './response-dto/find-order-response.dto';
import { FindOrderByIdQuery } from '../application/query/find-order-by-id.query';

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

    @Patch(':orderId')
    public async cancelOrder(@Headers() header: AuthorizedHeader, @Param() param: string): Promise<void> {
        const command = new CancelOrderCommand(param);
        await this.commandBus.execute(command);
    }

    @Patch(':order/ship')
    public async shipOrder(@Headers() header: AuthorizedHeader, @Param() param: string, @Body() dto: ShipOrderDto) {
        const command = new ShipOrderCommand(param, dto.trackingNumber, dto.deliveryDate);
        await this.commandBus.execute(command);
    }

    @Get()
    public async findOrders(@Query() query: { customerId?: string }): Promise<FindOrdersResponseDto> {
        const queryInstanse = new FindOrdersQuery(query.customerId);
        const orders = await this.queryBus.execute(queryInstanse);
        return { orders };
    }

    @Get(':orderId')
    public async findOrderById(@Param() param: string): Promise<FindOrderByIdResponseDto> {
        const query = new FindOrderByIdQuery(param);
        return this.queryBus.execute(query);
    }
}
