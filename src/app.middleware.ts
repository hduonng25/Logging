import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ElasticLogger } from './elastic/elastic.logger';

@Injectable()
export class AppMiddleware implements NestMiddleware {
   constructor(private readonly loggerService: ElasticLogger) {}

   use(req: Request, _: Response, next: NextFunction): any {
      this.loggerService.request('Request', { from: AppMiddleware.name });
      next();
   }
}
