import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ShippingCost } from 'src/order/domain/shipping-cost/shipping-cost';
import { ShippingCostCommandRepository } from 'src/order/infrastructure/repository/shipping-cost/shipping-cost-command.repository';

export class CreateShippingCostCommand {
    constructor(
        public readonly orderId: string,
        public readonly weight: number,
        public readonly dimensions: { length: number; width: number; height: number },
        public readonly shippingOptions: { expressDelivery: boolean; fragileHandling: boolean; insurance: boolean }
    ) {}
}

@CommandHandler(CreateShippingCostCommand)
export class CreateShippingCostHandler implements ICommandHandler<CreateShippingCostCommand> {
    constructor(
        private readonly shippingCostCommandRepository: ShippingCostCommandRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: CreateShippingCostCommand): Promise<ShippingCost> {
        const shippingCostDomain = ShippingCost.create({
            ...command,
        });

        return await this.shippingCostCommandRepository.createShippingCost(shippingCostDomain.data);

        // this.eventBus.publish(new ShippingCostCreatedEvent(command.orderId, shippingCostDomain.getCalculatedCost()));
    }
}
