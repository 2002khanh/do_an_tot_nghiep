import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, getConnection } from 'typeorm';
import { OrderDetailService } from '../order_detail/order_detail.service';
import { IUser } from '../users/users.interface';
import { FindOrderDto } from './dto/list-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { UpdateProductDto } from '../products/dto/update-product.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private readonly orderDetailService: OrderDetailService,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
  ) {}

  async create(createOrderDto: any, userId: string) {
    const {
      phone,
      address,
      paymentMethod,
      status,
      listProduct,
      totalPrice,
      note,
      username,
    } = createOrderDto;
    const create: Order = this.ordersRepository.create({
      username,
      phone,
      address,
      paymentMethod,
      status,
      totalPrice,
      note,
      user: userId,
    });

    await this.ordersRepository.save(create);

    listProduct.forEach(async (product: any) => {
      await this.orderDetailService.create({
        order: create.id,
        detailProduct: product.id,
        quantity: product.quantity,
        price: product.price,
      });
    });

    this.cartService.clearCartAfterPayment(userId);
  }

  async findOrderByUser(userId: string, queryData: FindOrderDto) {
    const {
      page,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryData;
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .where('user.id = :id', { id: userId });

    if (sortBy) {
      query.orderBy(
        `order.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [items, total] = await query.getManyAndCount();
    const totalPage = perPage ? Math.ceil(total / perPage) : 1;

    return {
      page: +page || 1,
      perPage: +perPage || total,
      rows: items,
      total,
      totalPage,
    };
  }

  async findAll(queryData: FindOrderDto) {
    const {
      page,
      perPage,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryData;
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user');

    if (search) {
      query.where('user.username LIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      query.orderBy(
        `order.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [items, total] = await query.getManyAndCount();
    const totalPage = perPage ? Math.ceil(total / perPage) : 1;
    return {
      page: +page || 1,
      perPage: +perPage || total,
      rows: items,
      total,
      totalPage,
    };
  }

  async findOne(orderId: string, userId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (!item) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp');
    }

    const orderDetail = await this.orderDetailService.findOneByOrderId(orderId);

    item['listProduct'] = orderDetail;

    return item;
  }

  async findOneIgnoreUserId(orderId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .andWhere('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (!item) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp');
    }

    const orderDetail = await this.orderDetailService.findOneByOrderId(orderId);

    item['listProduct'] = orderDetail;

    return item;
  }

  async isOrderSuccessed(orderId: string) {
    const order = await this.ordersRepository.findOneBy({
      id: orderId,
      status: 'Giao hàng thành công',
    });

    if (!order) {
      throw new BadRequestException('Đơn hàng chưa được giao thành công');
    }

    return order;
  }

  async update(id: string, status: string) {
    const [order, orderDetail] = await Promise.all([
      this.ordersRepository.findOneBy({
        id: id,
      }),
      this.orderDetailService.findOneByOrderId(id),
    ]);

    const beforeStatus = order.status;

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp');
    }

    order.status = status;

    await this.ordersRepository.save(order);

    if (
      beforeStatus !== 'Giao hàng thành công' &&
      status === 'Giao hàng thành công'
    ) {
      await Promise.all(
        orderDetail.map(async (item: any) => {
          return await this.productsService.update(
            item.detailProduct?.product?.id,
            {
              increaseTotalSold: item.quantity as number,
              quantity: (item.detailProduct.quantity as number) - item.quantity,
              price: item.detailProduct.price,
              content: item.detailProduct.content,
              detailProductId: item.detailProduct.id,
            } as UpdateProductDto,
          );
        }),
      );
    }

    if (
      beforeStatus === 'Giao hàng thành công' &&
      status !== 'Giao hàng thành công'
    ) {
      await Promise.all(
        orderDetail.map(async (item: any) => {
          return await this.productsService.update(
            item.detailProduct?.product?.id,
            {
              increaseTotalSold: (item.quantity as number) * -1,
              quantity: (item.detailProduct.quantity as number) + item.quantity,
              price: item.detailProduct.price,
              content: item.detailProduct.content,
              detailProductId: item.detailProduct.id,
            } as UpdateProductDto,
          );
        }),
      );
    }

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async getTotalOrder(startDate: Date, endDate: Date) {
    const result = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: 'Giao hàng thành công' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return {
      total: result.length,
    };
  }

  async getTotalSale(startDate: Date, endDate: Date) {
    const ordersTotal = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'totalPrice')
      .addSelect('YEAR(order.createdAt)', 'year')
      .addSelect('MONTH(order.createdAt)', 'month')
      .where('order.status = :status', { status: 'Giao hàng thành công' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('YEAR(order.createdAt), MONTH(order.createdAt)')
      .getRawMany();

    // Tạo danh sách tháng từ startDate đến endDate
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    const months = [];
    for (let year = startYear; year <= endYear; year++) {
      const monthStart =
        year === startYear ? new Date(startDate).getMonth() + 1 : 1;
      const monthEnd = year === endYear ? new Date(endDate).getMonth() + 1 : 12;
      for (let month = monthStart; month <= monthEnd; month++) {
        months.push({
          year: year,
          month: month,
          totalPrice: 0,
        });
      }
    }

    // Hợp nhất dữ liệu từ ordersTotal vào danh sách months
    ordersTotal.forEach((order) => {
      const monthIndex = months.findIndex(
        (m) => m.month === order.month && m.year === order.year,
      );
      if (monthIndex !== -1) {
        months[monthIndex].totalPrice = parseFloat(order.totalPrice);
      }
    });

    return months;
  }

  async handleCancelOrder(orderId: string, userId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (item.status == 'Chờ xác nhận') {
      item.status = 'Đã hủy';
      await this.ordersRepository.save(item);
      return item;
    } else if (item.status == 'Đã hủy') {
      throw new BadRequestException('Đơn hàng đã được hủy');
    } else {
      throw new BadRequestException(
        'Không thể hủy đơn hàng. Vui lòng liên hệ quản trị viên!',
      );
    }
  }

  async handleCancelOrder1(orderId: string, userId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (item.status == 'Chờ xác nhận') {
      item.status = 'Đã hủy';
      await this.ordersRepository.save(item);
      return item;
    } else if (item.status == 'Đã hủy') {
      throw new BadRequestException('Đơn hàng đã được hủy');
    } else {
      throw new BadRequestException(
        'Không thể hủy đơn hàng. Vui lòng liên hệ quản trị viên!',
      );
    }
  }

  async handleCancelOrder2(orderId: string, userId: string) {
    const query = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId });
    const item = await query.getOne();

    if (item.status == 'Chờ xác nhận') {
      item.status = 'Đã hủy';
      await this.ordersRepository.save(item);
      return item;
    } else if (item.status == 'Đã hủy') {
      throw new BadRequestException('Đơn hàng đã được hủy');
    } else {
      throw new BadRequestException(
        'Không thể hủy đơn hàng. Vui lòng liên hệ quản trị viên!',
      );
    }
  }
}
