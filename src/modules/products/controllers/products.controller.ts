import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { CreateProductRequestDto } from '../dtos/request/create-product.request.dto';
import { Product } from '../product.entity';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private productsService: ProductsService,
  ) {}

  @Get()
  getProducts(@Req() request): Promise<Product[]> {
    const filters = { ...request.params, ...request.query };
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) productId: number): Promise<Product> {
    return this.productsService.getProduct(productId);
  }

  @Post()
  async createProduct(@Body() createProductRequestDto: CreateProductRequestDto, @Req() request) {
    return this.productsService.createProduct(createProductRequestDto);
  }
}
