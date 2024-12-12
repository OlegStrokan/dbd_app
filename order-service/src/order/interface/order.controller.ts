import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderCommand } from '../application/command/order/create-order.command';
import { AuthorizedHeader } from 'src/libs/auth';
import { CompleteOrderCommand } from '../application/command/order/complete-order.command';
import { CancelOrderCommand } from '../application/command/order/cancel-order.command';
import { ShipOrderDto } from './dto/ship-order.dto';
import { ShipOrderCommand } from '../application/command/order/ship-order.command';
import { FindOrdersQuery } from '../application/query/find-orders.query';
import { FindOrdersResponseDto } from './response-dto/find-orders-response.dto';
import { FindOrderByIdResponseDto } from './response-dto/find-order-response.dto';
import { FindOrderByIdQuery } from '../application/query/find-order-by-id.query';
import { GetOrderAnalyticsResponseDto } from './response-dto/get-order-analytics-response.dto';
import { GetOrderAnalyticsQuery } from '../application/query/get-order-analytics.query';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus
    ) {}

    @Post()
    public async createOrder(@Body() dto: CreateOrderDto): Promise<void> {
        const command = new CreateOrderCommand(dto.customerId, dto.totalAmount, dto.orderItems);
        await this.commandBus.execute(command);
    }

    @Patch(':orderId')
    public async completeOrder(@Headers() header: AuthorizedHeader, @Param() param: string): Promise<void> {
        const command = new CompleteOrderCommand(param);
        await this.commandBus.execute(command);
    }

    @Patch(':orderId/cancel')
    public async cancelOrder(@Headers() header: AuthorizedHeader, @Param() param: { orderId: string }): Promise<void> {
        const command = new CancelOrderCommand(param.orderId);
        await this.commandBus.execute(command);
    }

    @Patch(':order/ship')
    public async shipOrder(@Headers() header: AuthorizedHeader, @Param() param: string, @Body() dto: ShipOrderDto) {
        const command = new ShipOrderCommand(param, dto.trackingNumber, dto.deliveryDate);
        await this.commandBus.execute(command);
    }

    @Get()
    public async findOrders(@Query() query: { customerId?: string }): Promise<FindOrdersResponseDto> {
        const queryInstanse = new FindOrdersQuery(query);
        return await this.queryBus.execute(queryInstanse);
    }

    @Get('/analytics')
    public async getAnalytics(@Query() query: { customerId?: string }): Promise<GetOrderAnalyticsResponseDto> {
        const queryInstanse = new GetOrderAnalyticsQuery(query);
        return this.queryBus.execute(queryInstanse);
    }

    @Get(':orderId')
    public async findOrderById(@Param() param: string): Promise<FindOrderByIdResponseDto> {
        const query = new FindOrderByIdQuery(param);
        return this.queryBus.execute(query);
    }
}
