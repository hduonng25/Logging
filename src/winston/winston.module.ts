import { Module } from '@nestjs/common';
import { ElasticTransportFactory } from './elastic.transport.factory';
import { LoggerWinston } from './logger.winston';

@Module({
   imports: [],
   providers: [ElasticTransportFactory, LoggerWinston],
   exports: [LoggerWinston],
})
export class WinsModule {}
