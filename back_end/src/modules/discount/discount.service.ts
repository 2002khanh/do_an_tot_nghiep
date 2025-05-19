import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { FindDiscountDto } from './dto/list-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const { startDate, endDate, discount } = createDiscountDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const existingDiscounts = await this.discountRepository
      .createQueryBuilder('discount')
      .getMany();

    // for (const discount of existingDiscounts) {
    //   const existingStart = discount.startDate;
    //   const existingEnd = discount.endDate;

    //   const isOverlapping =
    //     (start <= existingStart && end >= existingEnd) ||
    //     (start >= existingEnd && start <= existingStart);

    //   if (isOverlapping) {
    //     throw new BadRequestException(
    //       'Lịch giảm giá trùng với 1 lịch đã có. Vui lòng kiểm tra lại!',
    //     );
    //   }
    // }

    const newDiscount = this.discountRepository.create({
      startDate: start,
      endDate: end,
      discount: Number(discount),
    });

    return this.discountRepository.save(newDiscount);
  }

  async findAll(findDiscountDto: FindDiscountDto) {
    const { search, page, perPage } = findDiscountDto;

    const query = this.discountRepository
      .createQueryBuilder('discount')
      .leftJoinAndSelect('discount.products', 'product');

    query.orderBy('discount.createdAt', 'DESC');

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);
    }

    let [items, total] = await query.getManyAndCount();
    const totalPage = perPage ? Math.ceil(total / perPage) : 1;

    if (search) {
      let isValid = false;
      items = items.filter((item) => {
        item.products.forEach((product) => {
          if (product.productName.toLowerCase().includes(search.toLowerCase()))
            isValid = true;
        });
        return isValid;
      });
    }

    return {
      page: +page || 1,
      perPage: +perPage || total,
      rows: items,
      total,
      totalPage,
    };
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    const {
      discount: discountNum,
      startDate,
      endDate,
      products,
    } = updateDiscountDto;

    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!discount) {
      throw new NotFoundException('Không tìm thấy yêu cầu phù hợp');
    }

    if (discountNum) {
      discount.discount = discountNum;
    }

    if (startDate) {
      discount.startDate = new Date(startDate);
    }

    if (products && products.length > 0) {
      const listProduct = [];
      const batch = 10;

      for (let i = 0; i < products.length; i += batch) {
        const productsBatch = products.slice(i, i + batch);
        const promises = productsBatch.map((productId) => {
          return this.productsService.findProductById(productId);
        });

        const result = await Promise.all(promises);
        listProduct.push(...result);
      }

      discount.products = [...listProduct];
    }

    if (endDate) {
      discount.endDate = new Date(endDate);
    }

    discount.updatedAt = new Date();

    return this.discountRepository.save(discount);
  }

  async remove(id: string) {
    try {
      const discount = await this.discountRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      discount.products = [];
      await this.discountRepository.save(discount);

      const query = this.discountRepository
        .createQueryBuilder('discount')
        .delete()
        .where('discount.id = :id', { id });

      return query.execute();
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
