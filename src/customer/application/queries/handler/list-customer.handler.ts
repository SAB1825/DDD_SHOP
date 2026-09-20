import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomerQuery } from '../list-customer.query';
import { Customer } from '../../../domain/entities/cutomer-entitiy';
import { Inject } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from '../../ports/customer.repository.port';

@QueryHandler(ListCustomerQuery)
export class ListCustomerHandler implements IQueryHandler<
  ListCustomerHandler,
  Customer[]
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(query: ListCustomerHandler): Promise<Customer[]> {
    const customers = await this.customerRepo.findAll();

    return customers;
  }
}
