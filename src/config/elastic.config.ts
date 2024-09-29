import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { ElasticConfigType } from './elastic.config.type';

export default registerAs(
   '',
   (): ElasticConfigType => ({
      ELASTIC_NODE: process.env.ELASTIC_NODE,
      ELASTIC_USER: process.env.ELASTIC_USER,
      ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD,
      ELASTIC_INDEX: process.env.ELASTIC_INDEX,
      LOG_RETENTION_DAYS: +process.env.LOG_RETENTION_DAYS,
      IS_SENDLOG: process.env.ELASTIC_IS_SENDLOG === 'true',
   }),
);
