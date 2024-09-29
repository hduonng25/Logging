import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ElasticLogger } from './elastic/elastic.logger';

@Injectable()
export class AppInterceptor implements NestInterceptor {
   constructor(private readonly loggerService: ElasticLogger) {}

   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
         tap(() => {
            this.loggerService.response('Response', { from: AppInterceptor.name });
         }),
      );
   }
}
