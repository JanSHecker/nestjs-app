import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LolAPIService } from './lolAPI.service';

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  // @Get('lolInput')
  // getHello(): object {
  //   return this.LolAPIService.getLolInput();
  // }
  @Get('runGame')
  runGame() {
    this.appService.runGame();
  }
}
