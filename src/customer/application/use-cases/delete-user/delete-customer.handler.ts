import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from './delete-customer.command';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../ports/customer.repository.port';
import { CustomerId } from '../../../domain/value-object/cutomer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exception/application.exception';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<
  DeleteCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepository,
  ) {}
  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customerId = new CustomerId(command.id);

    const customer = await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new ApplicationException(
        'Customer not exists with the give id',
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.customerRepo.delete(customerId);
  }
}
