import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  createReward(rewardData: Partial<Reward>): Promise<Reward> {
    const reward = this.rewardRepository.create(rewardData);
    return this.rewardRepository.save(reward);
  }
  getRewards(playerId) {}
}
