import { Injectable, Logger } from '@nestjs/common';
import { ProductCategoryRepository } from './repository/product-category.repository';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryRequestDto } from './dtos/create-product-category.request.dto';

@Injectable()
export class ProductCategoriesService {
  private readonly logger = new Logger(ProductCategoriesService.name);

  constructor(
    private productCategoryRepository: ProductCategoryRepository,
  ) {}

  async findAll(filters: any): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find(filters);
  }

  async getProductCategory(productId: number): Promise<ProductCategory> {
    return this.productCategoryRepository.findOneOrFail(productId);
  }

  async createProductCategory(createProductCategoryRequestDto: CreateProductCategoryRequestDto): Promise<ProductCategory> {
    const { name, description, status } = createProductCategoryRequestDto;
    try {
      return await this.productCategoryRepository.manager.transaction(async (entityManager) => {
        const productData = {
          name,
          description,
          status,
        };

        const product = await entityManager.save(ProductCategory, productData);

        return product;
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
