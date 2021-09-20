import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateDishOutput } from 'src/restaurants/dtos/create-dish.dto'
import { Dish } from 'src/restaurants/entities/dish.entity'
import { Restaurant } from 'src/restaurants/entities/restaurant.entity'
import { User } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateOrderInput } from './dtos/create-order.dto'
import { OrderItem } from './entities/order-item.entity'
import { Order } from './entities/order.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}
  async CreateOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId)

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        }
      }

      let orderFinalPrice = 0
      const orderItems: OrderItem[] = []

      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId)

        if (!dish) {
          // abort this whole thing
          return {
            ok: false,
            error: 'Dish not found.',
          }
        }

        let dishFinalPrice = dish.price

        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          )

          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice += dishOption.extra
            } else {
              const dishOptionChoice = dishOption.chioces.find(
                (optionChoice) => optionChoice.name === itemOption.chioce,
              )
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice += dishOptionChoice.extra
                }
              }
            }
          }
        }
        console.log(`Dish Price : ${dishFinalPrice}`)

        orderFinalPrice += dishFinalPrice
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        )
        orderItems.push(orderItem)
      }

      console.log(orderFinalPrice)

      await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      )

      return {
        ok: true,
      }
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create order.',
      }
    }
  }
}
