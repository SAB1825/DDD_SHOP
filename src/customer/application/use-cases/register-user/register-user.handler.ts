import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCustomerCommand } from './register-user.command';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../ports/customer.repository.port';
import { CustomerEmail } from '../../../domain/value-object/cutomer-email.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exception/application.exception';
import { Customer } from '../../../domain/entities/cutomer-entitiy';

@CommandHandler(RegisterCustomerCommand)
export class RegisterCustomerHandler implements ICommandHandler<
  RegisterCustomerCommand,
  void
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<void> {
    const existingEmail = await this.customerRepository.findByEmail(
      CustomerEmail.create(command.email),
    );

    if (existingEmail) {
      throw new ApplicationException(
        'User with this email already existed',
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const customer = Customer.register(
      command.email,
      command.fistName,
      command.lastName,
      command.phone,
    );

    await this.customerRepository.register(customer);
  }
}
