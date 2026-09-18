import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.port';
import { Product } from '../../../domain/entities/product.entity';
import { Sku } from '../../../domain/value-objects/sku.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exception/application.exception';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}
  async execute(command: CreateProductCommand): Promise<void> {
    const existingSku = await this.productRepository.findBySku(
      Sku.create(command.sku),
    );
    if (existingSku) {
      throw new ApplicationException(
        `The product with SKU: ${command.sku} alread exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingName = await this.productRepository.findByName(command.name);
    if (existingName) {
      throw new ApplicationException(
        `The product with NAME: ${command.name} alread exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.currency,
      command.stock,
    );

    await this.productRepository.save(product);
  }
}
