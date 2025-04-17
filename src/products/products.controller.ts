import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { measureMemory } from 'vm';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @MessagePattern({ cmd: 'create_one_product'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  
  //@Get()
  @MessagePattern({ cmd: 'get_all_products'})
  //el payload se comporta igual que un body en una peticion http por eso no hay que cambiar la logica
  //interna en el servicio
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
  
  //@Get(':id')
  @MessagePattern({ cmd: 'get_one_product'})
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
  
  //@Patch(':id')
  @MessagePattern({ cmd: 'patch_one_product'})
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }
  
  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_one_product'})
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_products'})
  validateProduct(@Payload() ids:number[]) {
    return this.productsService.validateProducts(ids);
  }

}
