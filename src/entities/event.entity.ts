import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Takedown } from './takedown.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  eventId: number;

  @Column()
  ingameId: number;

  @Column()
  eventType: string;

  @ManyToOne(() => Game, (game) => game.events)
  game: Game;

  @OneToOne(() => Takedown, { cascade: true })
  @JoinColumn()
  takedown: Takedown;
}
