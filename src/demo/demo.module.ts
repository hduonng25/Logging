import { Module } from '@nestjs/common';
import { LogModule } from '../elastic/logger.module';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';

@Module({
   imports: [LogModule],
   providers: [DemoService],
   controllers: [DemoController],
})
export class DemoModule {}
