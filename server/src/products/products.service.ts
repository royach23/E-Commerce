import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDb } from '../db/db.module';
import { REDIS } from '../redis/redis.module';
import { products } from '../db/schema';
import { eq, ilike } from 'drizzle-orm';
import Redis from 'ioredis';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export function formatProduct(dbProduct: any) {
  return {
    product_id: dbProduct.productId,
    name: dbProduct.name,
    price: dbProduct.price,
    description: dbProduct.description,
    image: dbProduct.image,
    category: dbProduct.category,
    sizes: dbProduct.sizes,
    in_stock: dbProduct.inStock,
  };
}

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDb,
    @Inject(REDIS) private redis: Redis,
  ) {}

  private async getFromCache(key: string): Promise<any | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Redis error during get for key ${key}:`, error);
      return null;
    }
  }

  private async setToCache(key: string, value: any, expirySeconds = 60): Promise<void> {
    try {
      await this.redis.setex(key, expirySeconds, JSON.stringify(value));
    } catch (error) {
      console.error(`Redis error during set for key ${key}:`, error);
    }
  }

  private async invalidateProductCaches(): Promise<void> {
    try {
      await this.redis.del('all_products');
    } catch (error) {
      console.error('Redis error during invalidate:', error);
    }
  }

  async getAllProducts() {
    const cached = await this.getFromCache('all_products');
    if (cached) {
      return cached;
    }

    const dbProducts = await this.db.select().from(products);
    if (dbProducts.length === 0) {
      throw new NotFoundException('no products');
    }

    const formatted = dbProducts.map(formatProduct);
    await this.setToCache('all_products', formatted);
    return formatted;
  }

  async searchProducts(searchTerm: string) {
    const cacheKey = `search:${searchTerm}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    const dbProducts = await this.db
      .select()
      .from(products)
      .where(ilike(products.name, `%${searchTerm}%`));

    if (dbProducts.length === 0) {
      throw new NotFoundException('Product not found.');
    }

    const formatted = dbProducts.map(formatProduct);
    await this.setToCache(cacheKey, formatted, 60);
    return formatted;
  }

  async createProduct(dto: CreateProductDto) {
    const [newProduct] = await this.db
      .insert(products)
      .values({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        inStock: dto.in_stock,
        category: dto.category,
        sizes: dto.sizes,
        image: dto.image,
      })
      .returning();

    await this.invalidateProductCaches();
    return formatProduct(newProduct);
  }

  async deleteProduct(productId: number) {
    const [deleted] = await this.db
      .delete(products)
      .where(eq(products.productId, productId))
      .returning();

    if (!deleted) {
      throw new NotFoundException('product with such id does not exist');
    }

    await this.invalidateProductCaches();
  }

  async updateProduct(productId: number, dto: UpdateProductDto) {
    const [updated] = await this.db
      .update(products)
      .set({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        inStock: dto.in_stock,
        category: dto.category,
        sizes: dto.sizes,
        image: dto.image,
      })
      .where(eq(products.productId, productId))
      .returning();

    if (!updated) {
      throw new NotFoundException(`product with such id: ${productId} does not exist`);
    }

    await this.invalidateProductCaches();
    return formatProduct(updated);
  }
}
