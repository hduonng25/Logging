import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppInterceptor } from './app.interceptor';
import { AppMiddleware } from './app.middleware';
import { AppModule } from './app.module';
import { ElasticConfigType } from './config/elastic.config.type';
import { ElasticLogger } from './elastic';
import { LoggerWinston } from './winston';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   // const logger: ElasticLogger = app.get(ElasticLogger);

   // app.useGlobalInterceptors(new AppInterceptor(logger));
   const logger = app.get(LoggerWinston);
   logger.info('hduong25', { tags: 'Main' });
   await app.listen(3000);

   // logger.info('Application start on port: 3000', { from: 'Main' });
   // logger.info('hduong');
}

bootstrap();
