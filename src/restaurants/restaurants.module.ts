import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dish } from './entities/dish.entity'
import { Restaurant } from './entities/restaurant.entity'
import { CategoryRepository } from './repositories/category.repository'
import {
  CategoryResolver,
  DishResover,
  RestaurantResolver,
} from './restaurants.resolver'
import { RestaurantService } from './restaurants.service'

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
  providers: [
    RestaurantResolver,
    CategoryResolver,
    DishResover,
    RestaurantService,
  ],
})
export class RestaurantsModule {}
