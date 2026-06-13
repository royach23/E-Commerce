import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDb } from '../db/db.module';
import { transactions, transactionProducts } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionProductDto } from './dto/create-transaction-product.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

function formatProduct(dbProduct: any) {
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

function formatTransactionProduct(dbTp: any) {
  return {
    transaction_id: dbTp.transactionId,
    product_id: dbTp.productId,
    quantity: dbTp.quantity,
    size: dbTp.size,
    product: dbTp.product ? formatProduct(dbTp.product) : null,
  };
}

function formatTransaction(dbTx: any) {
  return {
    transaction_id: dbTx.transactionId,
    user_id: dbTx.userId,
    total_price: dbTx.totalPrice,
    purchase_time: dbTx.purchaseTime,
    order_status: dbTx.orderStatus,
    transaction_products: dbTx.transactionProducts
      ? dbTx.transactionProducts.map(formatTransactionProduct)
      : [],
  };
}

function getIsraelISOString() {
  const d = new Date();
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const base = formatter.format(d).replace(' ', 'T');

  const tzString = d.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem', timeZoneName: 'longOffset' });
  const match = tzString.match(/GMT([+-]\d+)(?::(\d+))?/);
  let offset = '+03:00';
  if (match) {
    const sign = match[1][0];
    const hours = match[1].slice(1).padStart(2, '0');
    const minutes = match[2] ? match[2].padStart(2, '0') : '00';
    offset = `${sign}${hours}:${minutes}`;
  }
  return `${base}${offset}`;
}

@Injectable()
export class TransactionsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDb) {}

  async getTransaction(transactionId: number) {
    const tx = await this.db.query.transactions.findFirst({
      where: eq(transactions.transactionId, transactionId),
      with: {
        transactionProducts: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!tx) {
      throw new NotFoundException(`transaction with such id: ${transactionId} does not exist`);
    }

    return formatTransaction(tx);
  }

  async getTransactionProducts(transactionId: number) {
    const tpList = await this.db.query.transactionProducts.findMany({
      where: eq(transactionProducts.transactionId, transactionId),
      with: {
        product: true,
      },
    });

    return tpList.map(formatTransactionProduct);
  }

  async getTransactionProduct(transactionId: number, productId: number) {
    const tp = await this.db.query.transactionProducts.findFirst({
      where: and(
        eq(transactionProducts.transactionId, transactionId),
        eq(transactionProducts.productId, productId),
      ),
      with: {
        product: true,
      },
    });

    if (!tp) {
      throw new NotFoundException('product or transaction with such id does not exist');
    }

    return formatTransactionProduct(tp);
  }

  async createTransaction(dto: CreateTransactionDto) {
    const purchaseTime = dto.purchase_time || getIsraelISOString();
    const [newTx] = await this.db
      .insert(transactions)
      .values({
        userId: dto.user_id,
        totalPrice: dto.total_price,
        purchaseTime: purchaseTime,
        orderStatus: 'PENDING',
      })
      .returning();

    // Query with relations to return formatted shape
    return this.getTransaction(newTx.transactionId);
  }

  async createTransactionProduct(transactionId: number, dto: CreateTransactionProductDto) {
    await this.db
      .insert(transactionProducts)
      .values({
        transactionId: transactionId,
        productId: dto.product_id,
        quantity: dto.quantity,
        size: dto.size,
      })
      .returning();

    // Return the updated transaction containing all products (expected by front-end map)
    return this.getTransaction(transactionId);
  }

  async deleteTransaction(transactionId: number) {
    const [deleted] = await this.db
      .delete(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .returning();

    if (!deleted) {
      throw new NotFoundException('transaction with such id does not exist');
    }
  }

  async deleteTransactionProduct(transactionId: number, productId: number) {
    const [deleted] = await this.db
      .delete(transactionProducts)
      .where(
        and(
          eq(transactionProducts.transactionId, transactionId),
          eq(transactionProducts.productId, productId),
        ),
      )
      .returning();

    if (!deleted) {
      throw new NotFoundException('product or transaction with such id does not exist');
    }
  }

  async updateTransaction(transactionId: number, dto: UpdateTransactionDto) {
    const tx = await this.db.query.transactions.findFirst({
      where: eq(transactions.transactionId, transactionId),
    });

    if (!tx) {
      throw new NotFoundException(`transaction with such id: ${transactionId} does not exist`);
    }

    await this.db
      .update(transactions)
      .set({
        userId: dto.user_id || tx.userId,
        totalPrice: dto.total_price || tx.totalPrice,
        purchaseTime: dto.purchase_time || tx.purchaseTime,
        orderStatus: dto.order_status || tx.orderStatus,
      })
      .where(eq(transactions.transactionId, transactionId));

    return this.getTransaction(transactionId);
  }
}
