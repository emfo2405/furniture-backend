import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Category,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductCategoryController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Product',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category),
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.string('id') id: typeof Product.prototype._id,
  ): Promise<Category> {
    return this.productRepository.category(id);
  }
}
