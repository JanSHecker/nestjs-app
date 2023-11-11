import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LolAPIService } from './lolAPI.service';

@Controller()
export class AppController {
  private readonly appService: AppService;
  private readonly lolApiService: LolAPIService;

  constructor(appService: AppService, lolApiService: LolAPIService) {
    this.appService = appService;
    this.lolApiService = lolApiService;
  }

  @Get('lolInput')
  getHello(): object {
    return this.lolApiService.getLolInput();
  }

  @Get('runGame')
  runGame() {
    this.appService.runGame();
    return { message: 'The game is running!' };
  }
}
