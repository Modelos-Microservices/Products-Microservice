import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { NatsModule } from 'src/nats/nats.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [NatsModule],
})
export class ProductsModule {}
