import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Punishment } from './entities/punishment.entity';

@Injectable()
export class PunishmentService {
  constructor(
    @InjectRepository(Punishment)
    private readonly punishmentRepository: Repository<Punishment>,
  ) {}

  createPunishment(punishmentData: Partial<Punishment>): Promise<Punishment> {
    const punishment = this.punishmentRepository.create(punishmentData);
    return this.punishmentRepository.save(punishment);
  }
}