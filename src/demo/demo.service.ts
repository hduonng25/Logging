import { Injectable } from '@nestjs/common';
import { ElasticLogger } from '../elastic/elastic.logger';

@Injectable()
export class DemoService {
   constructor(private readonly loggerService: ElasticLogger) {}

   public async testLog() {
      return this.loggerService.info('Demo');
   }
}
