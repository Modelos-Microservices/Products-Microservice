import { BadRequestException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Product } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProductsService {

  constructor(private readonly prisma: PrismaService, @Inject(NATS_SERVICE) private readonly client: ClientProxy) { }
  private readonly logger = new Logger(ProductsService.name)

  async create(createProductDto: CreateProductDto): Promise<Product> {
    //verificamos si la categoria existe
    const category = await firstValueFrom(this.client.send({ cmd: 'verifyCategory' }, createProductDto.categoryId))
    if (!category) {
      throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: `Category with id ${createProductDto.categoryId} not found` })
    }
    //verificamos si el producto ya existe
    const newProduct = this.prisma.product.create({ data: createProductDto });
    return newProduct;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto
    const totalProducts = await this.prisma.product.count({ where: { available: true } })
    const lastPage = Math.ceil(totalProducts / limit)
    return {
      meta: {
        lastPage: lastPage,
        actualPage: page,
        totalProducts: totalProducts
      },
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      })
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new RpcException({ status: HttpStatus.NOT_FOUND, message: `Product with id:${id} not found` })
    }
    return product;
  }

  async update(updateProductDto: UpdateProductDto): Promise<Product> {
    const { id, ...data } = updateProductDto
    await this.findOne(id)
    const newProduct = await this.prisma.product.update({ where: { id }, data: data })
    return newProduct;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id)
    if (!product.available) {
      throw new BadRequestException(`Product with id ${id} is already deleted`)
    }
    const productRemoved = this.prisma.product.update({ where: { id }, data: { available: false } })
    return productRemoved
  }

  async validateProducts(ids: number[]) {
    //limpiamos los ids duplicados
    ids = Array.from(new Set(ids))
    const products = await this.prisma.product.findMany({ where: { id: { in: ids } } })
    if (ids.length !== products.length) {
      throw new RpcException({ status: HttpStatus.BAD_REQUEST, message: `Please verify the ids of the products ${ids.length - products.length} are wrong` })
    }
    return products
  }
}
