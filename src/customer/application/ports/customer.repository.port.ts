import { Customer } from '../../domain/entities/cutomer-entitiy';
import { CustomerEmail } from '../../domain/value-object/cutomer-email.vo';
import { CustomerId } from '../../domain/value-object/cutomer-id.vo';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepository {
  register(customer: Customer): Promise<void>;
  findById(id: CustomerId): Promise<Customer | null>;
  findByEmail(email: CustomerEmail): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  delete(id: CustomerId): Promise<void>;
}
