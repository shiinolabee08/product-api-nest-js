import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/product.entity'

@Entity({ name: 'product-categories' })
export class ProductCategory extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'mediumtext',
  })
  description: string;

  @Column({
    type: 'int',
    default: 1,
  })
  status: number;

  @OneToMany(() => Product, (product: Product) => product.productCategory)
  products: Product[];
}