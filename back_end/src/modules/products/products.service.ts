import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { FindProductsDto } from './dto/list-product.dto';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BucketName } from 'src/constans/enum';
import { DetailProductService } from '../detail-product/detail-product.service';
import { FindDiscountProductsDto } from './dto/list-discount-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private readonly subcategoryService: SubcategoryService,
    private readonly minioClientService: MinioClientService,
    @Inject(forwardRef(() => DetailProductService))
    private readonly detailProductService: DetailProductService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const {
      subcategory,
      image,
      productName,
      description = '',
      trademark,
      content,
      price,
      quantity,
    } = createProductDto;
    const subcategoryFind = await this.subcategoryService.findOne(subcategory);
    const create = this.productsRepository.create({
      image,
      productName,
      description,
      trademark,
      detailName: 'Loại/Dung tích',
      subcategory: subcategoryFind,
    });
    const product = await this.productsRepository.save(create);
    await this.detailProductService.create({
      options: [
        {
          price,
          content,
          quantity,
        },
      ],
      product: product.id,
    });

    return product;
  }

  async findAll(findProductsDto: FindProductsDto) {
    const {
      search,
      page,
      category,
      subCategory,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .leftJoinAndSelect('product.detailProducts', 'detail-product')
      .leftJoinAndSelect('product.discounts', 'discount') // Join với bảng discounts
      .where('product.isActive = true')
      .andWhere('subcategory.isActive = true');

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category && subCategory) {
      query
        .andWhere('subcategory.slug = :subCategorySlug', {
          subCategorySlug: subCategory,
        })
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    } else if (category) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: category,
      });
    } else if (subCategory) {
      query.andWhere('subcategory.slug = :subCategorySlug', {
        subCategorySlug: subCategory,
      });
    }

    if (sortBy) {
      if (sortBy === 'price') {
        query.orderBy(
          `detail-product.price`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
      } else {
        query.orderBy(
          `product.${sortBy}`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
      }
    }

    if (page && perPage) {
      query.skip((page - 1) * perPage).take(perPage);
    }

    const [items, total] = await query.getManyAndCount();
    const totalPage = perPage ? Math.ceil(total / perPage) : 1;

    const currentTime = new Date();
    let validDiscount = null;
    const rows = items.map((product) => {
      const validDiscounts = product.discounts.filter(
        (discount) =>
          currentTime >= new Date(discount.startDate) &&
          currentTime <= new Date(discount.endDate),
      );

      validDiscount = validDiscounts.length
        ? validDiscounts.reduce((prev, current) =>
            new Date(prev.updatedAt).getTime() >
            new Date(current.updatedAt).getTime()
              ? prev
              : current,
          )
        : null;

      if (validDiscount) {
        const updatedDetailProducts = product.detailProducts.map(
          (detailProduct) => {
            const price = detailProduct.price;
            const discountPrice = validDiscount
              ? price - (price * validDiscount.discount) / 100
              : price;

            return {
              ...detailProduct,
              finalPrice: discountPrice,
            };
          },
        );
        return {
          ...product,
          detailProducts: updatedDetailProducts,
          discountCurrent: validDiscount,
        };
      } else {
        return {
          ...product,
        };
      }
    });

    return {
      page: +page || 1,
      perPage: +perPage || total,
      rows,
      total,
      totalPage,
    };
  }

  async findAllByAdmin(findProductsDto: FindProductsDto) {
    const {
      search,
      page,
      category,
      subCategory,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.subcategory', 'subcategory')
      .innerJoinAndSelect('subcategory.category', 'category')
      .leftJoinAndSelect('product.detailProducts', 'detail-product')
      .andWhere('subcategory.isActive');

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category && subCategory) {
      query
        .andWhere('subcategory.slug = :subCategorySlug', {
          subCategorySlug: subCategory,
        })
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    } else if (category) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: category,
      });
    } else if (subCategory) {
      query.andWhere('subcategory.slug = :subCategorySlug', {
        subCategorySlug: subCategory,
      });
    }

    if (sortBy) {
      if (sortBy === 'price') {
        query.orderBy(
          `detail-product.price`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
      } else {
        query.orderBy(
          `product.${sortBy}`,
          sortOrder.toUpperCase() as 'ASC' | 'DESC',
        );
      }
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

  async findAllAdmin(findProductsDto: FindProductsDto) {
    const {
      search,
      page,
      category,
      subCategory,
      perPage,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.subcategory', 'subcategory')
      .innerJoinAndSelect('subcategory.category', 'category');

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category && subCategory) {
      query
        .andWhere('subcategory.slug = :subCategorySlug', {
          subCategorySlug: subCategory,
        })
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    } else if (category) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: category,
      });
    } else if (subCategory) {
      query.andWhere('subcategory.slug = :subCategorySlug', {
        subCategorySlug: subCategory,
      });
    }

    if (sortBy) {
      query.orderBy(
        `product.${sortBy}`,
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

  async findProductById(id: string) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm tương ứng');
    }

    return product;
  }

  async getDiscountByProduct(findDiscountProductsDto: FindDiscountProductsDto) {
    const { search, page, perPage } = findDiscountProductsDto;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.discounts', 'discount')
      .orderBy('discount.startDate')
      .select([
        'product.id',
        'product.productName',
        'discount.id',
        'discount.discount',
        'discount.startDate',
        'discount.endDate',
      ]);

    if (search) {
      query.andWhere('product.productName LIKE :search', {
        search: `%${search}%`,
      });
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

  async getDiscountByProductId(productId: string) {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.discounts', 'discount')
      .where('product.id = :productId', { productId })
      .orderBy('discount.startDate')
      .select([
        'product.id',
        'product.productName',
        'discount.id',
        'discount.discount',
        'discount.startDate',
        'discount.endDate',
      ]);

    const [total] = await query.getMany();

    return total;
  }

  async findOne(id: string) {
    const product = await this.productsRepository
      .createQueryBuilder('products')
      .innerJoinAndSelect('products.subcategory', 'subcategory')
      .leftJoinAndSelect('products.detailProducts', 'detail-product')
      .leftJoinAndSelect('products.discounts', 'discount') // Join với bảng discounts
      .where('products.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm tương ứng');
    }

    const currentTime = new Date();

    const validDiscount = product.discounts.find(
      (discount) =>
        currentTime >= new Date(discount.startDate) &&
        currentTime <= new Date(discount.endDate),
    );

    if (validDiscount) {
      const updatedDetailProducts = product.detailProducts.map(
        (detailProduct) => {
          const price = detailProduct.price;
          const discountPrice = validDiscount
            ? price - (price * validDiscount.discount) / 100
            : price;

          return {
            ...detailProduct,
            finalPrice: discountPrice,
          };
        },
      );
      return {
        ...product,
        detailProducts: updatedDetailProducts,
      };
    } else {
      return product;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {
      content,
      productName,
      price,
      detailProductId,
      subcategory,
      image,
      isActive,
      description,
      trademark,
      increaseTotalSold,
      quantity,
    } = updateProductDto;

    const product = await this.productsRepository.findOneBy({
      id: id,
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm phù hợp');
    }

    if (subcategory) {
      const subcategoryInstance =
        await this.subcategoryService.findOne(subcategory);
      if (!subcategoryInstance) {
        throw new NotFoundException('Không tìm thấy danh mục phù hợp');
      }
      product.subcategory = subcategoryInstance;
    }

    let updatedDetailProduct;
    if (detailProductId) {
      updatedDetailProduct = this.detailProductService.update(
        {
          quantity,
          price,
          content,
        },
        detailProductId,
      );
    }

    if (image) {
      product.image = image;
    }

    if (productName) {
      product.productName = productName;
    }

    if (isActive || isActive === false) {
      product.isActive = isActive;
    }

    if (description) {
      product.description = description;
    }

    if (trademark) {
      product.trademark = trademark;
    }

    product.detailName = 'Loại/Dung tích';

    if (increaseTotalSold) {
      product.totalSold = (product.totalSold || 0) + increaseTotalSold;
    }

    await Promise.all([
      updatedDetailProduct,
      this.productsRepository.save(product),
    ]);

    return product;
  }

  async remove(productId: string) {
    try {
      const query = this.productsRepository
        .createQueryBuilder('products')
        .delete()
        .where('products.id = :productId', { productId });

      await this.detailProductService.removeByProductId(productId);
      return query.execute();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Sản phẩm đã được sử dụng. Không thể xóa',
        );
      } else {
        throw new BadRequestException();
      }
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const urlImage = await this.minioClientService.uploadFile(
        file,
        BucketName.PRODUCTS_BUCKET,
      );
      return urlImage;
    } catch (err) {
      console.log(err);
    }
  }

  async updateRateAvg(productId: string, rateAvg: number, totalRate: number) {
    const product = await this.findProductById(productId);

    product.rateAvg = rateAvg;

    product.rateTotal = totalRate;

    await this.productsRepository.save(product);

    return product;
  }

  async getTotalProduct() {
    const result = await this.productsRepository.findBy({
      isActive: true,
    });

    return {
      total: result.length,
    };
  }
}
