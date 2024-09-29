import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticConfigType } from '../config/elastic.config.type';
import { ElasticManager } from './elastic.manager';
import { ElasticLogger } from './elastic.logger';

@Module({
   imports: [
      ElasticsearchModule.registerAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService<ElasticConfigType>) => ({
            node: configService.getOrThrow('ELASTIC_NODE', { infer: true }),
            auth: {
               username: configService.getOrThrow('ELASTIC_USER', { infer: true }),
               password: configService.getOrThrow('ELASTIC_PASSWORD', { infer: true }),
            },
         }),
         inject: [ConfigService],
      }),
   ],
   providers: [ElasticLogger, ElasticManager],
   exports: [ElasticLogger, ElasticManager],
})
export class LogModule {}
