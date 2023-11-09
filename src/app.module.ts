import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { Takedown } from './entities/takedown.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Champion } from './entities/champion.entity';
import { Player } from 'src/entities/player.entity';
import { Team } from 'src/entities/team.entity';
import { Punishment } from 'src/entities/punishment.entity';
import { Game } from 'src/entities/game.entity';
import { Event } from 'src/entities/event.entity';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([
      Champion,
      Takedown,
      Punishment,
      Game,
      Event,
      Player,
      Team,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
