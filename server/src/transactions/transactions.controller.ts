import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionProductDto } from './dto/create-transaction-product.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':transaction_id')
  async getTransaction(@Param('transaction_id') transactionId: string) {
    return this.transactionsService.getTransaction(parseInt(transactionId, 10));
  }

  @Get(':transaction_id/products')
  async getTransactionProducts(@Param('transaction_id') transactionId: string) {
    return this.transactionsService.getTransactionProducts(parseInt(transactionId, 10));
  }

  @Get(':transaction_id/product/:product_id')
  async getTransactionProduct(
    @Param('transaction_id') transactionId: string,
    @Param('product_id') productId: string,
  ) {
    return this.transactionsService.getTransactionProduct(
      parseInt(transactionId, 10),
      parseInt(productId, 10),
    );
  }

  @Post()
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  @Post(':transaction_id/product')
  async createTransactionProduct(
    @Param('transaction_id') transactionId: string,
    @Body() dto: CreateTransactionProductDto,
  ) {
    return this.transactionsService.createTransactionProduct(parseInt(transactionId, 10), dto);
  }

  @Delete(':transaction_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('transaction_id') transactionId: string) {
    await this.transactionsService.deleteTransaction(parseInt(transactionId, 10));
  }

  @Delete(':transaction_id/product/:product_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransactionProduct(
    @Param('transaction_id') transactionId: string,
    @Param('product_id') productId: string,
  ) {
    await this.transactionsService.deleteTransactionProduct(
      parseInt(transactionId, 10),
      parseInt(productId, 10),
    );
  }

  @Put(':transaction_id')
  async updateTransaction(
    @Param('transaction_id') transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(parseInt(transactionId, 10), dto);
  }
}
