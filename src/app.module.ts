import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppMiddleware } from './app.middleware';
import ElasticConfig from './config/elastic.config';
import { LogModule } from './elastic/logger.module';
import { DemoModule } from './demo/demo.module';
import { WinsModule } from './winston/winston.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: ['.env'],
         isGlobal: true,
         load: [ElasticConfig],
      }),
      LogModule,
      DemoModule,
      WinsModule,
   ],
   controllers: [],
   providers: [],
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer): any {
      consumer.apply(AppMiddleware).forRoutes('*');
   }
}
