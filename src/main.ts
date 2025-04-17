import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
     {
       transport: Transport.NATS,
       options : {
        servers: envs.nats_servers,
       }
      });

  const logger = new Logger('Products');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen();//esta linea es la que hace que el microservicio escuche las peticiones
  logger.log(`Products Microservice running on port ${envs.port}`);
  logger.log(envs.nats_servers)
}
bootstrap();
