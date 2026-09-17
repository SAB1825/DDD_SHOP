import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.port';
import {
  DRIZZLE,
  DrizzleDb,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import { Product } from '../../domain/entities/product.entity';
import { products } from '../../../shared/infrastructure/database/postgres/schema';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { Sku } from '../../domain/value-objects/sku.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { and, eq, lte, SQL } from 'drizzle-orm';
import { gte } from 'drizzle-orm';

@Injectable()
//It implements the ProductRepository port so that it can have the method that product repository needs
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async save(product: Product): Promise<void> {
    const row = DrizzleProductRepository.toPersistence(product);
    await this.db
      .insert(products)
      .values(row)
      // This updates the product if its already exists
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: row.name,
          description: row.description,
          sku: row.sku,
          priceAmount: row.priceAmount,
          priceCurrency: row.priceCurrency,
          stock: row.stock,
          isActive: row.isActive,
          lowStockThreshold: row.lowStockThreshold,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.getValue()));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async findByAll(filters: ProductFilters): Promise<Product[]> {
    //Here we push the set of commands that we need based on filter option set
    const conditions: SQL[] = [];

    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(
        //gte: Greater than or equal to
        gte(products.priceAmount, Math.round(filters.minPrice * 100)),
      );
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(
        //Less than equal to.
        lte(products.priceAmount, Math.round(filters.maxPrice * 100)),
      );
    }

    const query = this.db.select().from(products);

    const productRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return productRows.map((row) => DrizzleProductRepository.toDomain(row));
  }

  // It converts the domain value(object) to database readable rows
  // Ex:
  // Product:
  //    price: Money
  //    sku: Sku
  //    id: ProductId
  //
  // becomes:
  // Database row
  //      priceAmount: 1999
  //      priceCurrency: "INR"
  //      sku: "KEY-001"
  //      id: "uuid"
  private static toPersistence(product: Product): typeof products.$inferSelect {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceCurrency: product.price.getCurrency(),
      priceAmount: product.price.toCents(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // It is opposite of toPersistence
  // It conversts the database value to the domain values(objects)
  private static toDomain(row: typeof products.$inferSelect): Product {
    return Product.reconstitute({
      id: new ProductId(row.id),
      name: row.name,
      description: row.description,
      sku: Sku.create(row.sku),
      price: Money.create(row.priceAmount / 100, row.priceCurrency),
      stock: row.stock,
      isActive: row.isActive,
      lowStockThreshold: row.lowStockThreshold,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
