import { Controller, Get } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
   constructor(private readonly demoService: DemoService) {}

   @Get()
   public async demo() {
      return this.demoService.testLog();
   }
}
