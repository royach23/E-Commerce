import { pgTable, serial, varchar, doublePrecision, boolean, integer, timestamp, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const categoryEnum = pgEnum('category', ['CASUAL', 'WINTER', 'FORMAL', 'SPORTS']);
export const sizeEnum = pgEnum('size', ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']);
export const orderStatusEnum = pgEnum('orderstatus', ['PENDING', 'COMPLETED', 'CANCELED']);

// Users Table
export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  username: varchar('username').notNull().unique(),
  password: varchar('password').notNull(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  address: varchar('address').notNull(),
  phoneNumber: varchar('phone_number').notNull().unique(),
  email: varchar('email').notNull().unique(),
});

// Products Table
export const products = pgTable('products', {
  productId: serial('product_id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  price: doublePrecision('price').notNull(),
  inStock: boolean('in_stock').notNull(),
  category: categoryEnum('category'),
  sizes: sizeEnum('sizes').array(),
  image: varchar('image'),
});

// Transactions Table
export const transactions = pgTable('transactions', {
  transactionId: serial('transaction_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.userId),
  totalPrice: doublePrecision('total_price').notNull(),
  purchaseTime: timestamp('purchase_time', { mode: 'string' }).notNull(),
  orderStatus: orderStatusEnum('order_status').notNull().default('PENDING'),
});

// Transaction Products (Join Table)
export const transactionProducts = pgTable('transaction_products', {
  transactionId: integer('transaction_id')
    .notNull()
    .references(() => transactions.transactionId, { onDelete: 'cascade' }),
  productId: integer('product_id')
    .notNull()
    .references(() => products.productId),
  quantity: integer('quantity').notNull(),
  size: sizeEnum('size').notNull(),
}, (table) => [
  primaryKey({ columns: [table.transactionId, table.productId, table.size] })
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.userId],
  }),
  transactionProducts: many(transactionProducts),
}));

export const productsRelations = relations(products, ({ many }) => ({
  transactionProducts: many(transactionProducts),
}));

export const transactionProductsRelations = relations(transactionProducts, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionProducts.transactionId],
    references: [transactions.transactionId],
  }),
  product: one(products, {
    fields: [transactionProducts.productId],
    references: [products.productId],
  }),
}));
