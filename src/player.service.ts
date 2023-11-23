import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { PunishmentService } from './punishment.service';
import { RewardService } from './reward.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly punishmentService: PunishmentService,
    private readonly rewardService: RewardService,
  ) {}

  async createPlayer(playerData: Partial<Player>) {
    const player = await this.playerRepository.create(playerData);
    await this.playerRepository.save(player);
    return player;
  }
  async getAllPlayers(gameId) {
    const allPlayers = await this.playerRepository
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.game = :gameID', { gameID: gameId })
      .getMany();
    const players = {
      blue: allPlayers.filter(function (player) {
        if (player.team !== null) {
          return player.team.teamName === 0;
        }
      }),
      red: allPlayers.filter(function (player) {
        if (player.team !== null) {
          return player.team.teamName === 1;
        }
      }),
    };
    return players;
  }
  async joinTeam(playerId, teamId) {
    await this.playerRepository
      .createQueryBuilder('player')
      .update(Player)
      .set({
        team: teamId,
      })
      .where('playerId =:playerID', { playerID: playerId })
      .execute();
  }
  async chooseChampion(playerChampionPair) {
    await this.playerRepository
      .createQueryBuilder('player')
      .update(Player)
      .set({
        champion: playerChampionPair.champion,
      })
      .where('playerId =:playerID', { playerID: playerChampionPair.player })
      .execute();
  }

  async getPunishmentsAndRewards(playerId) {
    const pNR = {
      punishments: await this.punishmentService.getPunishments(playerId),
      rewards: await this.rewardService.getRewards(playerId),
    };

    return pNR;
  }
  async getChampionPlayer(champion) {
    return this.playerRepository
      .createQueryBuilder('player')
      .leftJoinAndSelect('player.champion', 'champion')
      .where('player.champion =:championID', {
        championID: champion.championId,
      })
      .getOne();
  }
}
