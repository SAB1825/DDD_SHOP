import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProductQuery } from '../list-product.query';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.port';
import { privateDecrypt } from 'crypto';
import { Product } from '../../../domain/entities/product.entity';

@QueryHandler(ListProductQuery)
export class ListProductsHandler implements IQueryHandler<ListProductQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: ListProductQuery): Promise<Product[]> {
    return this.productRepository.findByAll({
      isActive: query.isActive,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
  }
}
