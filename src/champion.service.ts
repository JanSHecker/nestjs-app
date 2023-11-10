import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Champion } from './entities/champion.entity';
import { Game } from './entities/game.entity';

@Injectable()
export class ChampionService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepository: Repository<Champion>,
  ) {}

  createChampion(championData: Partial<Champion>): Promise<Champion> {
    const champion = this.championRepository.create(championData);
    return this.championRepository.save(champion);
  }
  async getChampion(summonerName: string, game: Game) {
    const champion = await this.championRepository
      .createQueryBuilder('champion')
      .leftJoinAndSelect('champion.team', 'team')
      .where('champion.summonerName = :name', { name: summonerName })
      .andWhere('team.game = :gameID', { gameID: game.gameId })
      .getOne();
    return champion;
  }
}
