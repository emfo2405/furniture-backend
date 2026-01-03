import {Entity, model, property, hasMany} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Category extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
