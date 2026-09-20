import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerController } from './presentation/customer.controller';
import { CommandHandler } from './application/use-cases';
import { CUSTOMER_REPOSITORY } from './application/ports/customer.repository.port';
import { DrizzleCustomerRepository } from './infrastructure/adapters/drizzle-customer.repository';
import { QueryHandler } from './application/queries/handler';

@Module({
  imports: [CqrsModule],
  controllers: [CustomerController],
  providers: [
    ...CommandHandler,
    ...QueryHandler,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: DrizzleCustomerRepository,
    },
  ],
})
export class CustomerModule {}
