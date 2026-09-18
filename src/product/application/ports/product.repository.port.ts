import { Product } from '../../domain/entities/product.entity';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { Sku } from '../../domain/value-objects/sku.vo';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: ProductId): Promise<Product | null>;
  findBySku(sku: Sku): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findByAll(filters: ProductFilters): Promise<Product[]>;
}

// 1. We are using port and adapters architecture (Hexagonal architecture)
// 2. This port defines what is needs. (Like to manage Products we need methods like save, find etc)
// 3. Adapter basically implement this port and talk to the db.
// 4. Since this is an interface it will be not available at runtime.
// 5. So we use Symbol to generate a unique token that matches to this interface.
