import { errors } from '@elastic/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticConfigType } from '../config/elastic.config.type';

@Injectable()
export class ElasticManager {
   private index: string;
   private isSend: boolean;
   private readonly retention: number;
   private readonly logger: Logger = new Logger(ElasticManager.name);

   constructor(
      private readonly esService: ElasticsearchService,
      private readonly configService: ConfigService<ElasticConfigType>,
   ) {
      this.retention = this.configService.get('LOG_RETENTION_DAYS', { infer: true }) || 30;
      this.isSend = this.configService.get('IS_SENDLOG', { infer: true }) || false;
      this.checkConnected();
   }

   private async checkConnected() {
      if (!this.isSend) return;

      let isConnected: boolean = false;
      let numberOfTrial: number = 0;
      const maxTrial: number = 5;

      while (!isConnected && numberOfTrial < maxTrial) {
         try {
            const health = await this.esService.cluster.health();

            if (health.status === 'green' || health.status === 'yellow') {
               console.log('Kết nối đến Elasticsearch thành công!');
               isConnected = true;
               break;
            }
         } catch (error) {
            numberOfTrial++;
            if (error instanceof errors.ConnectionError) {
               console.error(
                  `Lỗi kết nối đến Elasticsearch lần thứ ${numberOfTrial}:`,
                  error.message,
               );
            } else {
               console.error('Lỗi xảy ra:', error.message);
            }
            console.log('Thử lại kết nối...');
            await new Promise((res) => setTimeout(res, 1000));
         }
      }

      if (isConnected) {
         await this.elasticInit();
      } else {
         console.error(`Không thể kết nối đến Elasticsearch sau ${maxTrial} lần thử.`);
      }
   }

   private async elasticInit() {
      try {
         const today = new Date();
         today.setHours(today.getHours() + 7);
         const dateString: string = today.toISOString().split('T')[0];
         const indexWithDate = `${this.configService.getOrThrow('ELASTIC_INDEX')}-${dateString}`;

         this.index = `${this.configService.getOrThrow('ELASTIC_INDEX')}-${dateString}`;

         const templateExists: boolean = await this.esService.indices.existsIndexTemplate({
            name: `${this.index}-template`,
         });

         if (!templateExists) {
            await this.esService.indices.putIndexTemplate({
               name: `${this.index}-template`,
               index_patterns: [`${this.index}-*`],
               priority: 1,
               template: {
                  settings: {
                     number_of_shards: 1,
                     number_of_replicas: 1,
                     index: {
                        lifecycle: {
                           name: `${this.index}-policy`,
                        },
                     },
                  },
                  mappings: {
                     properties: {
                        message: { type: 'text' },
                        level: { type: 'keyword' },
                        '@timestamp': { type: 'date' },
                        '@request': { type: 'keyword' },
                        '@response': { type: 'keyword' },
                        '@exception': { type: 'keyword' },
                     },
                  },
               },
            });

            this.logger.log(`Index template for ${this.index} created successfully.`);
         }

         await this.esService.ilm.putLifecycle({
            name: `${this.index}-policy`,
            policy: {
               phases: {
                  hot: {
                     actions: {
                        rollover: {
                           max_age: '1d',
                           max_size: '50gb',
                        },
                     },
                  },
                  delete: {
                     min_age: `${this.retention}d`,
                     actions: {
                        delete: {},
                     },
                  },
               },
            },
         });
         this.logger.log(`ILM policy for ${this.index} updated or created.`);

         // Kiểm tra xem index đã tồn tại hay chưa
         const indexExists: boolean = await this.esService.indices.exists({ index: indexWithDate });

         if (!indexExists) {
            await this.esService.indices.create({
               index: indexWithDate,
               settings: {
                  number_of_shards: 1,
                  number_of_replicas: 1,
               },
               mappings: {
                  properties: {
                     message: { type: 'text' },
                     level: { type: 'keyword' },
                     '@timestamp': { type: 'date' },
                     '@request': { type: 'keyword' },
                     '@response': { type: 'keyword' },
                     '@exception': { type: 'keyword' },
                  },
               },
            });
            this.logger.log(`Initial index ${indexWithDate} created successfully.`);
         }

         // Kiểm tra xem alias đã tồn tại hay chưa
         const aliasExists: boolean = await this.esService.indices.existsAlias({
            name: `${this.index}-alias`,
         });

         if (!aliasExists) {
            // Tạo alias
            await this.esService.indices.putAlias({
               index: indexWithDate,
               name: `${this.index}-alias`,
               is_write_index: true,
            });
            this.logger.log(`Alias ${this.index}-alias created successfully.`);
         } else {
            this.logger.log(`Alias ${this.index}-alias already exists.`);
         }
      } catch (error) {
         if (error instanceof errors.ConnectionError) {
            console.error('Can not connect to Elastic');
         } else {
            this.logger.error(`Elasticsearch error: ${error.message}`, error.stack);
         }
      }
   }

   public async sendLog(level: string, message: any, context: any = {}) {
      const timestamp: string = new Date().toISOString();
      await this.esService.index({
         index: this.index,
         document: {
            '@timestamp': timestamp,
            level,
            message,
            ...context,
         },
      });
   }
}
