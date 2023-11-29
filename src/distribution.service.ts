import { Injectable } from '@nestjs/common';
import { PunishmentService } from './punishment.service';
import { PlayerService } from './player.service';

@Injectable()
export class DistributionService {
  constructor(
    private readonly punishmentService: PunishmentService,
    private readonly playerService: PlayerService,
  ) {}

  async distributePunishment(punishmentIds) {
    console.log(punishmentIds);
    const distributor = await this.playerService.getChampionPlayer(
      punishmentIds.distributor,
    );
    const punishmentData = {
      amount: parseInt(punishmentIds.amount),
      punishmentType: 2,
      distributor: distributor,
      takedown: null,
      player: punishmentIds.recipient,
    };
    this.punishmentService.createPunishment(punishmentData);
  }
}
