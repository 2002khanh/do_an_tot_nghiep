import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDetailProductDto } from './dto/create-detail-product.dto';
import { UpdateDetailProductDto } from './dto/update-detail-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailProduct } from './entities/detail-product.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class DetailProductService {
  constructor(
    @InjectRepository(DetailProduct)
    private detailProductRepository: Repository<DetailProduct>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(createDetailProductDto: CreateDetailProductDto) {
    const { product, options } = createDetailProductDto;

    await this.productsService.findProductById(product);

    const listDetailProduct = await this.detailProductRepository.find({
      where: {
        product: product,
      },
    });

    const listContent = listDetailProduct.map((item) => item.content);
    const listContentCheck = [...listContent];
    let isValid = true;

    const listPromise = [];

    for (let option of options) {
      const { content } = option;
      if (listContentCheck.includes(content)) {
        isValid = false;
        break;
      }
      listContentCheck.push(content);
    }

    if (isValid) {
      for (let option of options) {
        const { price, content, quantity } = option;
        if (listContent.includes(content)) {
          isValid = false;
          break;
        }
        const create: DetailProduct = this.detailProductRepository.create({
          price,
          content,
          product,
          quantity,
        });
        listContent.push(content);
        listPromise.push(this.detailProductRepository.save(create));
      }

      await Promise.all(listPromise);
      return {
        success: 'true',
      };
    } else {
      throw new BadRequestException('Tên options không được trùng lặp');
    }
  }

  async findDetailProductById(id: string) {
    const product = await this.detailProductRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm tương ứng');
    }

    return product;
  }

  async findProductAndDetailProductById(detailProductId: string) {
    const query = this.detailProductRepository
      .createQueryBuilder('detail_product')
      .innerJoinAndSelect('detail_product.product', 'products')
      .where('detail_product.id = :detailProductId', { detailProductId });

    return query.getOne();
  }

  async update(updateDetailProductDto: UpdateDetailProductDto, id: string) {
    const { quantity, price, content } = updateDetailProductDto;

    const detailProduct = await this.detailProductRepository.findOneBy({
      id: id,
    });

    if (!detailProduct) {
      throw new NotFoundException('Không tìm thấy chi tiết sản phẩm phù hợp');
    }

    if (quantity || quantity == 0) {
      detailProduct.quantity = quantity;
    }

    if (price || price == 0) {
      detailProduct.price = price;
    }

    if (content) {
      detailProduct.content = content;
    }

    await this.detailProductRepository.save(detailProduct);

    return detailProduct;
  }

  async remove(id: string) {
    const detailProduct = await this.detailProductRepository.findOneBy({
      id: id,
    });

    if (!detailProduct) {
      throw new NotFoundException('Không tìm thấy option tương ứng');
    }

    return this.detailProductRepository.delete({
      id: id,
    });
  }
  async removeByProductId(productId: string) {
    const detailProducts = await this.detailProductRepository.findBy({
      product: productId,
    });

    if (!detailProducts || detailProducts.length === 0) {
      throw new NotFoundException('Không tìm thấy option tương ứng');
    }

    await this.detailProductRepository.delete(
      detailProducts.map((dp) => dp.id),
    );
    return { deletedCount: detailProducts.length };
  }
}
