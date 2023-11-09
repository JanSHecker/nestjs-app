import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  @Get('lolInput')
  getHello(): object {
    return this.appService.getLolInput();
  }
  @Get('runGame')
  runGame() {
    this.appService.runGame();
  }
}
