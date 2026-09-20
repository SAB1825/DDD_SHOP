import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../get-customer.query';
import { Customer } from '../../../domain/entities/cutomer-entitiy';
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

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<
  GetCustomerQuery,
  Customer
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepo.findById(new CustomerId(query.id));

    if (!customer)
      throw new ApplicationException(
        'Customer not found with this id',
        ApplicationExceptionCode.NOT_FOUND,
      );

    return customer;
  }
}
