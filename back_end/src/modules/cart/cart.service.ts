import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { DetailProductService } from '../detail-product/detail-product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
    private readonly detailProductService: DetailProductService,
  ) {}

  async create(createCartDto: CreateCartDto, id: string) {
    try {
      const { detailProduct, quantity } = createCartDto;
      const detailProductResult =
        await this.detailProductService.findDetailProductById(detailProduct);
      const resultFindCart: any = await this.checkDetailProductExistsCart(
        id,
        detailProduct,
      );

      if (resultFindCart) {
        if (resultFindCart.quantity >= detailProductResult.quantity) {
          throw new BadRequestException(
            'Số lượng yêu cầu vượt quá số lượng trong kho!',
          );
        }

        resultFindCart.quantity += quantity;
        const updatedCart = await this.cartsRepository.save(resultFindCart);
        return {
          statusCode: 200,
          message: 'Cập nhật giỏ hàng thành công',
          data: updatedCart,
        };
      }

      const create: Cart = this.cartsRepository.create({
        user: id,
        quantity,
        detailProduct,
      });
      const newCart = await this.cartsRepository.save(create);
      return {
        statusCode: 201,
        message: 'Tạo giỏ hàng thành công',
        data: newCart,
      };
    } catch (err) {
      throw new BadRequestException(
        err.message || 'Có lỗi xảy ra khi xử lý yêu cầu',
      );
    }
  }

  async deleteProductOfCart(userId: string, detailProductId: string) {
    const resultFindCart = await this.checkDetailProductExistsCart(
      userId,
      detailProductId,
    );

    if (!resultFindCart) {
      throw new NotFoundException('Không tìm thấy sản phẩm phù hợp');
    }

    await this.cartsRepository
      .createQueryBuilder('cart')
      .delete()
      .where('cart.user = :id', { id: userId })
      .andWhere('cart.detailProduct = :detailProduct', {
        detailProduct: detailProductId,
      })
      .execute();
  }

  async checkDetailProductExistsCart(
    userId,
    detailProductId,
  ): Promise<Cart | boolean> {
    const query = this.cartsRepository
      .createQueryBuilder('cart')
      .where('cart.user = :id', { id: userId })
      .andWhere('cart.detailProduct = :detailProduct', {
        detailProduct: detailProductId,
      });

    const item = await query.getOne();
    if (item) return item;
    return false;
  }

  async clearCartAfterPayment(userId: string) {
    await this.cartsRepository
      .createQueryBuilder('cart')
      .delete()
      .where('cart.user = :id', { id: userId })
      .execute();
  }

  async findCartByUser(id: string) {
    const query = this.cartsRepository
      .createQueryBuilder('cart')
      .innerJoinAndSelect('cart.user', 'user')
      .innerJoinAndSelect('cart.detailProduct', 'detail-product')
      .innerJoinAndSelect('detail-product.product', 'products')
      .leftJoinAndSelect('products.discounts', 'discount')
      .where('user.id = :id', { id });

    const [items, total] = await query.getManyAndCount();

    const currentTime = new Date();
    items.map((cart: any) => {
      const validDiscount = cart.detailProduct.product.discounts.find(
        (discount: any) =>
          currentTime >= new Date(discount.startDate) &&
          currentTime <= new Date(discount.endDate),
      );

      if (validDiscount) {
        const price = cart.detailProduct.price;
        const discountPrice = validDiscount
          ? price - (price * validDiscount.discount) / 100
          : price;

        cart.detailProduct['finalPrice'] = discountPrice;
      }
      return cart;
    });
    return {
      rows: items,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(cartId: string, updateCartDto: UpdateCartDto, userId: string) {
    const { quantity } = updateCartDto;
    const cart = await this.cartsRepository.findOneBy({
      id: cartId,
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng tương ứng');
    }

    cart.quantity = quantity;

    await this.cartsRepository.save(cart);

    return cart;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
