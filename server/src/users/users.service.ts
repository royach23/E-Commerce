import { Inject, Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDb } from '../db/db.module';
import { users, transactions } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export function formatUser(dbUser: any) {
  return {
    user_id: dbUser.userId,
    username: dbUser.username,
    first_name: dbUser.firstName,
    last_name: dbUser.lastName,
    address: dbUser.address,
    phone_number: dbUser.phoneNumber,
    email: dbUser.email,
  };
}

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

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDb,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      const [newUser] = await this.db
        .insert(users)
        .values({
          username: dto.username,
          password: hashedPassword,
          firstName: dto.first_name,
          lastName: dto.last_name,
          address: dto.address,
          phoneNumber: dto.phone_number,
          email: dto.email,
        })
        .returning();

      const token = await this.jwtService.signAsync({ sub: newUser.username });
      return {
        access_token: token,
        token_type: 'bearer',
        user: formatUser(newUser),
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Username, email, or phone number already exists');
      }
      throw error;
    }
  }

  async authenticateUser(dto: LoginDto) {
    const dbUser = await this.db.query.users.findFirst({
      where: eq(users.username, dto.username),
    });

    if (!dbUser || !(await bcrypt.compare(dto.password, dbUser.password))) {
      throw new UnauthorizedException('invalid username or password');
    }

    const token = await this.jwtService.signAsync({ sub: dbUser.username });
    return {
      access_token: token,
      token_type: 'bearer',
      user: formatUser(dbUser),
    };
  }

  async verifyUser(currentUsername: string) {
    const dbUser = await this.db.query.users.findFirst({
      where: eq(users.username, currentUsername),
    });

    if (!dbUser) {
      throw new UnauthorizedException('invalid user details');
    }

    const token = await this.jwtService.signAsync({ sub: dbUser.username });
    return {
      access_token: token,
      user: formatUser(dbUser),
    };
  }

  async deleteUser(userId: number, currentUsername: string) {
    const dbUser = await this.db.query.users.findFirst({
      where: eq(users.userId, userId),
    });

    if (!dbUser) {
      throw new NotFoundException('user with such id does not exist');
    }

    if (dbUser.username !== currentUsername) {
      throw new UnauthorizedException('unauthorized action');
    }

    await this.db.delete(users).where(eq(users.userId, userId));
  }

  async updateUser(userId: number, dto: UpdateUserDto, currentUsername: string) {
    const dbUser = await this.db.query.users.findFirst({
      where: eq(users.userId, userId),
    });

    if (!dbUser) {
      throw new NotFoundException(`user with such id: ${userId} does not exist`);
    }

    if (dbUser.username !== currentUsername) {
      throw new UnauthorizedException('unauthorized action');
    }

    let hashedPassword = dbUser.password;
    if (dto.password && dto.password !== 'none') {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    }

    const [updatedUser] = await this.db
      .update(users)
      .set({
        firstName: dto.first_name || dbUser.firstName,
        lastName: dto.last_name || dbUser.lastName,
        address: dto.address || dbUser.address,
        phoneNumber: dto.phone_number || dbUser.phoneNumber,
        email: dto.email || dbUser.email,
        password: hashedPassword,
      })
      .where(eq(users.userId, userId))
      .returning();

    return formatUser(updatedUser);
  }

  async getUserTransactions(userId: number) {
    const dbTxList = await this.db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      with: {
        transactionProducts: {
          with: {
            product: true,
          },
        },
      },
    });

    return dbTxList.map(formatTransaction);
  }
}
