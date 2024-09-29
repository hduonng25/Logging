import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ElasticTransportFactory } from './elastic.transport.factory';

@Injectable()
export class LoggerWinston {
   private readonly logger: winston.Logger;

   constructor(private readonly elasticTransportFactory: ElasticTransportFactory) {
      const format = winston.format.printf((info: winston.Logform.TransformableInfo) => {
         return `${info.timestamp} - [${info.level.toUpperCase()}] - [${info.tags || 'NestApplication'}]: ${info.message}`;
      });

      const transport: DailyRotateFile = new DailyRotateFile({
         level: 'info',
         filename: 'logs/application-%DATE%.log',
         datePattern: 'YYYY-MM-DD',
         zippedArchive: true,
         maxSize: '20m',
         maxFiles: '14d',
      });

      const elasticTransport = this.elasticTransportFactory.createElasticTransport();

      this.logger = winston.createLogger({
         format: winston.format.combine(
            winston.format.timestamp({
               format: new Date().toISOString(),
            }),
            format,
         ),
         transports: [transport, elasticTransport, new winston.transports.Console()],
      });
   }

   private log(level: string, message: any, context: any = {}) {
      this.logger.log(level, message, context);
   }

   public info(message: any, context: any = {}) {
      this.log('info', message, context);
   }
}
