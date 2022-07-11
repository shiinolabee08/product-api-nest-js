import { Injectable, Logger } from '@nestjs/common';
import { CreateProductRequestDto } from '../dtos/request/create-product.request.dto';
import { Product } from '../product.entity';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private productRepository: ProductRepository,
  ) {}

  async findAll(filters): Promise<Product[]> {
    return this.productRepository.find(filters);
  }

  async getProduct(productId: number): Promise<Product> {
    return this.productRepository.findOneOrFail(productId);
  }

  async createProduct(createProductRequestDto: CreateProductRequestDto): Promise<Product> {
    const { name, sku, description, price, status } = createProductRequestDto;
    try {
      return await this.productRepository.manager.transaction(async (entityManager) => {
        const productData = {
          name,
          sku,
          description,
          price,
          status,
        };

        const product = await entityManager.save(Product, productData);

        return product;
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
