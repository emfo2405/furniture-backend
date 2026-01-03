import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Product, ProductRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype._id,
  ProductRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Product.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Product, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
