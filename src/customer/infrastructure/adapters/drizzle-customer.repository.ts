import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../application/ports/customer.repository.port';
import {
  DRIZZLE,
  DrizzleDb,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import { Customer } from '../../domain/entities/cutomer-entitiy';
import { customers } from '../../../shared/infrastructure/database/postgres/schema';
import { CustomerId } from '../../domain/value-object/cutomer-id.vo';
import { CustomerEmail } from '../../domain/value-object/cutomer-email.vo';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async register(customer: Customer): Promise<void> {
    const row = DrizzleCustomerRepository.toPersistance(customer);
    await this.db
      .insert(customers)
      .values(row)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          email: customer.email.getValue(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          isActive: customer.isActive,
          updatedAt: customer.updatedAt,
        },
      });
  }

  async findById(id: CustomerId): Promise<Customer | null> {
    const customerId = id.getValue();

    const row = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId));

    if (row.length === 0) return null;

    return DrizzleCustomerRepository.toDomain(row[0]);
  }

  async findByEmail(email: CustomerEmail): Promise<Customer | null> {
    const row = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    if (row.length === 0) return null;

    return DrizzleCustomerRepository.toDomain(row[0]);
  }

  async findAll(): Promise<Customer[]> {
    const rows = await this.db.select().from(customers);
    return rows.map((row) => DrizzleCustomerRepository.toDomain(row));
  }

  async delete(id: CustomerId): Promise<void> {
    await this.db.delete(customers).where(eq(customers.id, id.getValue()));
  }

  private static toPersistance(
    customer: Customer,
  ): typeof customers.$inferSelect {
    return {
      id: customer.id.getValue(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.getValue(),
      isActive: customer.isActive,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private static toDomain(row: typeof customers.$inferSelect): Customer {
    return Customer.reconstitute({
      id: new CustomerId(row.id),
      firstName: row.firstName,
      lastName: row.lastName,
      email: CustomerEmail.create(row.email),
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      phone: row.phone,
    });
  }
}
