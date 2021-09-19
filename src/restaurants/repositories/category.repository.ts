import { EntityRepository, Repository } from 'typeorm'
import { Category } from '../entities/category.entity'

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase()

    const cateogrySlug = categoryName.replace(/ /g, '-')
    let category = await this.findOne({ slug: cateogrySlug })
    if (!category) {
      category = await this.save(
        this.create({ slug: cateogrySlug, name: categoryName }),
      )
    }

    return category
  }
}
