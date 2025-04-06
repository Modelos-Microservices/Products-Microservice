import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Product } from '@prisma/client';
import { PaginationDto } from 'src/common';


@Injectable()
export class ProductsService {

  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<Product>{
    const newProduct = this.prisma.product.create({data: createProductDto});
    return newProduct;
  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto
    const totalPages = await this.prisma.product.count({where:{available:true}})
    const lastPage = Math.ceil(totalPages/limit)
    return {
      meta:{
        lastPage: lastPage,
        actualPage: page,
        totalPages: totalPages
      },
      data: await this.prisma.product.findMany({
        skip: (page - 1) *limit,
        take: limit,
        where: {available: true}
      })
    }
  }

  async findOne(id: number):Promise<Product> {
    const product = await this.prisma.product.findUnique({where:{id}})
    if(!product){
      throw new NotFoundException(`Product with id:${id} not found`)
    }
    return product;
  }

  async update( updateProductDto: UpdateProductDto): Promise<Product> {
    const {id, ...data} = updateProductDto
    await this.findOne(id)
    const newProduct = await this.prisma.product.update({where:{id}, data: data})
    return newProduct;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id)
    if(!product.available) {
      throw new BadRequestException(`Product with id ${id} is already deleted`)
    }
    const productRemoved = this.prisma.product.update({where:{id}, data: {available : false}})
    return productRemoved
  }
}
