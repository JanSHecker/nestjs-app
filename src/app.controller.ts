import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { LolAPIService } from './lolAPI.service';
import { PlayerService } from './player.service';
import { ChampionService } from './champion.service';
import { GameService } from './game.service';
import { PunishmentService } from './punishment.service';
import { RewardService } from './reward.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly lolApiService: LolAPIService,
    private readonly playerService: PlayerService,
    private readonly championService: ChampionService,
    private readonly gameService: GameService,
    private readonly punishmentService: PunishmentService,
    private readonly rewardService: RewardService,
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
  async createPlayer(@Body() playerData) {
    return await this.playerService.createPlayer(playerData);
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
  getAllChampions(@Query('id') game) {
    return this.championService.getAllChampions(game);
  }
  @Post('chooseChampion')
  chooseChampion(@Body() playerChampionPair) {
    this.playerService.chooseChampion(playerChampionPair);
  }
  @Get('Punishments&Rewards')
  getPunishmentsAndRewards(@Query('id') player) {
    return this.playerService.getPunishmentsAndRewards(player);
  }
  @Post('Dummygame')
  createDummygame(@Body() game) {
    this.gameService.createDummygame(game.id);
  }
  @Post('createPunishment')
  createPunishment(@Body() punishment) {
    this.punishmentService.createPunishment(punishment);
  }
  @Get('kda')
  getKDA(@Query('id') champion) {
    return this.championService.getKDA(champion);
  }
  @Post('confirmPunishment')
  confirmPunishment(@Body() punishment) {
    this.punishmentService.confirmPunishment(punishment.id);
  }
  @Post('confirmReward')
  confirmReward(@Body() reward) {
    this.rewardService.confirmReward(reward);
  }
  @Get('getChangeCounters')
  getChangeCounter(@Query('id') playerId) {
    return this.playerService.getChangeCounters(playerId);
  }
  @Get('Status')
  async getStatus(
    @Query('playerId') playerId,
    @Query('championId') championId,
    @Query('enemyTeam') teamId,
  ) {
    const status = {
      punishments: await this.punishmentService.getPunishments(playerId),
      rewards: await this.rewardService.getRewards(playerId),
      counter: await this.playerService.getChangeCounters(playerId),
      kda: await this.championService.getKDA(championId),
      enemyTeam: await this.championService.getTeamChampions(teamId),
    };
    console.log(status);
    return status;
  }
}
