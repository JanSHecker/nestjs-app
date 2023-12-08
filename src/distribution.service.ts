import { Injectable } from '@nestjs/common';
import { PunishmentService } from './punishment.service';
import { PlayerService } from './player.service';
import { RewardService } from './reward.service';

@Injectable()
export class DistributionService {
  constructor(
    private readonly punishmentService: PunishmentService,
    private readonly playerService: PlayerService,
    private readonly rewardService: RewardService,
  ) {}

  async distributePunishment(reward) {
    console.log({ reward });
    const dbReward = await this.rewardService.getReward(reward.id);
    console.log({ dbReward });
    if (dbReward.distributed === false) {
      const distributor = await this.playerService.getChampionPlayer(
        reward.punishment.distributor,
      );
      console.log({ distributor });
      const punishmentData = {
        amount: parseInt(reward.punishment.amount),
        punishmentType: reward.punishment.punishmentType,
        distributor: distributor,
        takedown: null,
        player: reward.punishment.recipient,
      };
      this.punishmentService.createPunishment(punishmentData);
    }
  }
}
