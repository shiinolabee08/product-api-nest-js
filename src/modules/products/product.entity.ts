import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ColumnNumericTransformer } from '../../common/classes/column-numeric-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { ProductStatusEnum } from '../../common/enums/product-status.enum';
import { ProductCategory } from '../product-categories/entities/product-category.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  sku: string;

  @Column({
    type: 'mediumtext',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  imageUrl: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column({
    type: 'int',
    default: ProductStatusEnum.DRAFTED,
  })
  status: number | ProductStatusEnum;

  @ManyToMany('ProductCategory')
  @JoinTable({
    name: 'product_product_categories',
  })
  productCategories: ProductCategory[];
}