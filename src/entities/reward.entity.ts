import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Player } from './player.entity';
import { Event } from './event.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  rewardId: number;

  @Column()
  amount: number;

  @Column()
  rewardType: number;

  @ManyToOne(() => Player, (player) => player.rewards)
  player: Player;

  @OneToOne(() => Event, (event) => event.reward)
  event: Event;
}
