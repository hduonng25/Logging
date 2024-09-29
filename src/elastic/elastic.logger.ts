import { Injectable, Logger } from '@nestjs/common';
import { ElasticManager } from './elastic.manager';

@Injectable()
export class ElasticLogger {
   private readonly logger: Logger = new Logger(ElasticLogger.name);

   constructor(private readonly elasticManager: ElasticManager) {}

   public async info(message: any, context: any = {}) {
      await this.elasticManager.sendLog('info', message, context);
      this.logger.log(message);
   }

   public async error(message: any, context: any = {}) {
      await this.elasticManager.sendLog('error', message, context);
      this.logger.error(message);
   }

   public async warn(message: any, context: any = {}) {
      await this.elasticManager.sendLog('warn', message, context);
      this.logger.warn(message);
   }

   public async debug(message: any, context: any = {}) {
      await this.elasticManager.sendLog('debug', message, context);
      this.logger.debug(message);
   }

   public async request(message: any, context: any = {}) {
      await this.elasticManager.sendLog('info', message, context);
      this.logger.verbose(message);
   }

   public async response(message: any, context: any = {}) {
      await this.elasticManager.sendLog('info', message, context);
      this.logger.fatal(message);
   }

   public async exception(message: any, context: any = {}) {
      await this.elasticManager.sendLog('info', message, context);
      this.logger.error(message);
   }
}
