import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchTransport, ElasticsearchTransportOptions } from 'winston-elasticsearch';
import { ElasticConfigType } from '../config/elastic.config.type';

@Injectable()
export class ElasticTransportFactory {
   constructor(private readonly configService: ConfigService<ElasticConfigType>) {}

   public createElasticTransport(): ElasticsearchTransport {
      const node: string = this.configService.getOrThrow('ELASTIC_NODE', { infer: true });
      const username: string = this.configService.getOrThrow('ELASTIC_USER', { infer: true });
      const password: string = this.configService.getOrThrow('ELASTIC_PASSWORD', { infer: true });
      const indexPrefix: string = this.configService.getOrThrow('ELASTIC_INDEX', { infer: true });

      const options: ElasticsearchTransportOptions = {
         level: 'info',
         clientOpts: {
            node: node,
            auth: {
               username,
               password,
            },
         },
         indexPrefix,
         ensureIndexTemplate: true,
      };

      return new ElasticsearchTransport(options);
   }
}
