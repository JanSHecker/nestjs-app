import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Team } from './team.entity';
import { Champion } from './champion.entity';
import { Punishment } from './punishment.entity';
import { Game } from './game.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  playerId: number;

  @Column()
  playerName: string;

  @ManyToOne(() => Team, (team) => team.players)
  team: Team;
  @ManyToOne(() => Game, (game) => game.players)
  game: Game;

  @OneToOne(() => Champion, (champion) => champion.player)
  champion: Champion;

  @OneToMany(() => Punishment, (punishment) => punishment.player)
  punishments: Punishment[];
}
