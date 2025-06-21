import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { CreateProductRequestDto } from '../products/dtos/request/create-product.request.dto';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryRequestDto } from './dtos/create-product-category.request.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  private readonly logger = new Logger(ProductCategoriesController.name);

  constructor(
    private productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  getProductCategories(@Req() request): Promise<ProductCategory[]> {
    const filters = { ...request.params, ...request.query };
    return this.productCategoriesService.findAll(filters);
  }

  @Get(':id')
  getProductCategory(@Param('id', ParseIntPipe) productCategoryId: number): Promise<ProductCategory> {
    return this.productCategoriesService.getProductCategory(productCategoryId);
  }

  @Post()
  async createProductCategory(@Body() createProductCategoryRequestDto: CreateProductCategoryRequestDto, @Req() request) {
    return this.productCategoriesService.createProductCategory(createProductCategoryRequestDto);
  }
}
