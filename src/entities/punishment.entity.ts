import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Player } from './player.entity';
import { Takedown } from './takedown.entity';

@Entity()
export class Punishment {
  @PrimaryGeneratedColumn()
  punishmentId: number;

  @Column()
  amount: number;

  @Column()
  punishmentType: number;

  @ManyToOne(() => Player, (player) => player.punishments)
  player: Player;

  @OneToOne(() => Takedown, (takedown) => takedown.punishment)
  takedown: Takedown;
}
