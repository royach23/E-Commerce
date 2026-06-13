import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('product/search/:search_term')
  async searchProducts(@Param('search_term') searchTerm: string) {
    return this.productsService.searchProducts(searchTerm);
  }

  @Post('product')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Delete('product/:product_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('product_id') productId: string) {
    await this.productsService.deleteProduct(parseInt(productId, 10));
  }

  @Put('product/:product_id')
  async updateProduct(
    @Param('product_id') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(parseInt(productId, 10), dto);
  }
}
