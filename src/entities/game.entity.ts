import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { Team } from './team.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  gameId: number;

  @OneToMany(() => Event, (event) => event.game)
  events: Event[];

  @OneToMany(() => Team, (team) => team.game)
  teams: Team[];
}
