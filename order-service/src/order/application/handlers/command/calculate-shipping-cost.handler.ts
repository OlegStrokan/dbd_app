import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateShippingCostCommand } from 'src/order/domain/order/event/shipping-cost-calculated.event';
import { ShippingCost } from 'src/order/domain/shipping-cost/shipping-cost';
import { IShippingCostCommandRepository } from 'src/order/domain/shipping-cost/shipping-cost-command.repository';

@CommandHandler(CreateShippingCostCommand)
export class CreateShippingCostHandler implements ICommandHandler<CreateShippingCostCommand> {
    constructor(
        private readonly shippingCostCommandRepository: IShippingCostCommandRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: CreateShippingCostCommand): Promise<ShippingCost> {
        const { parcels, ...commandWithouParcels } = command;
        const shippingCost = ShippingCost.create({ ...commandWithouParcels });
        return await this.shippingCostCommandRepository.create(shippingCost.data);

        // this.eventBus.publish(new ShippingCostCreatedEvent(command.orderId, shippingCostDomain.getCalculatedCost()));
    }
}
