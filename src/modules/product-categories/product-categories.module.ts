import { Module } from '@nestjs/common';
import { ProductCategoriesController } from './product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoryRepository } from './repository/product-category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategoryRepository,
    ]),
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService]
})
export class ProductCategoriesModule {}
