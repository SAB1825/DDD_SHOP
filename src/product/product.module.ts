import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository';
import { CommandHandler } from './application';
import { QueryHandler } from './application/queries/handler';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...CommandHandler,
    ...QueryHandler,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
