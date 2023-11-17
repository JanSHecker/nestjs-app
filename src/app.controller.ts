import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { LolAPIService } from './lolAPI.service';
import { PlayerService } from './player.service';
import { ChampionService } from './champion.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly lolApiService: LolAPIService,
    private readonly playerService: PlayerService,
    private readonly championService: ChampionService,
  ) {}

  @Get('lolInput')
  getHello(): object {
    return this.lolApiService.getLolInput();
  }

  @Get('runGame')
  runGame() {
    this.appService.runGame();
    return { message: 'The game is running!' };
  }
  @Post('createPlayer')
  createPlayer(@Body() playerData) {
    this.playerService.createPlayer(playerData);
  }
  @Get('allPlayers')
  getAllPlayers(@Query('id') gameId) {
    return this.playerService.getAllPlayers(gameId);
  }
  @Post('joinTeam')
  joinTeam(@Body() playerTeamPair) {
    this.playerService.joinTeam(playerTeamPair.player, playerTeamPair.team);
  }
  @Get('getAllChampions')
  getAllChampions(@Body() game) {
    return this.championService.getAllChampions(game.id);
  }
}
