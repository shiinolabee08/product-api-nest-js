import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/product.entity'

@Entity({ name: 'product_categories' })
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

  @ManyToMany('Product')
  @JoinTable({
    name: 'product_product_categories',
  })
  products: Product[];
}