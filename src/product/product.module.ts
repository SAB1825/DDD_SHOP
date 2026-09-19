import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository';
import { CommandHandler } from './application';
import { QueryHandler } from './application/queries/handler';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...CommandHandler,
    ...QueryHandler,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
      useFactory: (
        configService: ConfigService,
        mongoDb: MongoProductRepository,
        drizzleDb: DrizzleProductRepository,
      ) => {
        const activeDatabase =
          configService.getOrThrow<string>('ACTIVE_DATABASE');

        console.log('ACTIVE_DATABASE:', activeDatabase);

        return activeDatabase === 'mongodb' ? mongoDb : drizzleDb;
      },
    },
  ],
})
export class ProductModule {}
