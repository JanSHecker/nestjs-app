import { Injectable } from '@nestjs/common';
import axios from 'axios';
import https from 'https';
import { Repository } from 'typeorm';
import { Champion } from './entities/champion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Takedown } from './entities/takedown.entity';
import {
  AllGameDataResponse,
  AllPlayer,
  Event as LolEvent,
} from './lolAPItypes';
import { Team } from './entities/team.entity';
import { Game } from './entities/game.entity';
import { Player } from './entities/player.entity';
import { Event } from './entities/event.entity';
import { Punishment } from './entities/punishment.entity';

@Injectable()
export class AppService {
  private readonly championRepository: Repository<Champion>;
  private readonly takedownRepository: Repository<Takedown>;
  private readonly teamRepository: Repository<Team>;
  private readonly gameRepository: Repository<Game>;
  private readonly playerRepository: Repository<Player>;
  private readonly eventRepository: Repository<Event>;
  private readonly punishmentRepository: Repository<Punishment>;

  constructor(
    @InjectRepository(Champion)
    championRepository: Repository<Champion>,
    @InjectRepository(Takedown)
    takedownRepository: Repository<Takedown>,
    @InjectRepository(Team)
    teamRepository: Repository<Team>,
    @InjectRepository(Game)
    gameRepository: Repository<Game>,
    @InjectRepository(Player)
    playerRepository: Repository<Player>,
    @InjectRepository(Event)
    eventRepository: Repository<Event>,
    @InjectRepository(Punishment)
    punishmentRepository: Repository<Punishment>,
  ) {
    this.championRepository = championRepository;
    this.takedownRepository = takedownRepository;
    this.teamRepository = teamRepository;
    this.gameRepository = gameRepository;
    this.playerRepository = playerRepository;
    this.eventRepository = eventRepository;
    this.punishmentRepository = punishmentRepository;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getLolInput() {
    const champion = this.championRepository.create({
      summonerName: 'moederge',
      championName: 'Warwick',
    });
    await this.championRepository.save(champion);

    const takedown = this.takedownRepository.create({
      multiKill: 1,
      shutdown: false,
      killer: champion,
      assistor: [champion, champion],
    });
    await this.takedownRepository.save(takedown);

    // champion.kills = [takedown];
    // await this.championRepository.save(champion);
    console.log('Champion has been saved');

    const axiosInstance = axios.create({
      baseURL: 'https://127.0.0.1:2999/liveclientdata/allgamedata',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Ignore SSL certificate errors
    });
    const lolAllData = 'https://127.0.0.1:2999/liveclientdata/allgamedata';
    const response = await axiosInstance.get(lolAllData);
    const responseData = response.data as AllGameDataResponse;

    return responseData;
  }
  async runGame() {
    let gameEnded = false;
    let input = await this.getLolInput();
    const game = await this.setUpTeams(input.allPlayers);

    while (!gameEnded) {
      const priorInput = input;
      input = await this.getLolInput();
      const newInput = this.filterNewEvents(input, priorInput);
      this.saveEvents(newInput.events.Events, game);
      gameEnded = await this.hasGameEnded(game);
    }
  }
  async setUpTeams(champions: AllPlayer[]) {
    let game = await this.createGame();
    const teamOrder = await this.createTeam(0, game);
    const teamChaos = await this.createTeam(1, game);
    game.teams = [teamOrder, teamChaos];
    for (const champ of champions) {
      let championTeam;
      if (champ.team === 'ORDER') {
        championTeam = teamOrder;
      } else {
        championTeam = teamChaos;
      }
      const championTemplate = {
        championName: champ.championName,
        summonerName: champ.summonerName,
        team: championTeam,
      };
      const createdChampion = await this.createChampion(championTemplate);
      // if (createdChampion.team === game.teams[0]) {
      //   game.teams[0].champions.push(createdChampion);
      // } else {
      //   game.teams[1].champions.push(createdChampion);
      // }
    }
    game = await this.setupPlayerRoster(game); //to-do
    return game;
  }

  async saveEvents(newEventData: LolEvent[], activeGame: Game) {
    for (const event of newEventData) {
      const eventTemplate = {
        ingameId: event.EventID,
        eventType: event.EventName,
        game: activeGame,
      };
      console.log(eventTemplate);
      const createdEvent = await this.createEvent(eventTemplate);
      if (createdEvent.eventType === 'ChampionKill') {
        const takedownTemplate = {
          multikill: 1,
          event: createdEvent,
          killer: await this.getChampion(event.KillerName, activeGame),
          killed: await this.getChampion(event.VictimName, activeGame),
        };

        const createdTakedown = await this.createTakedown(takedownTemplate);
        const punishmentTemplate = {
          takedown: createdTakedown,
          amount: 3,
        };

        this.createPunishment(punishmentTemplate);
      }
    }
  }

  createChampion(championData: Partial<Champion>): Promise<Champion> {
    const champion = this.championRepository.create(championData);
    return this.championRepository.save(champion);
  }
  createTeam(name: number, activeGame: Game): Promise<Team> {
    const team = this.teamRepository.create({
      teamName: name,
      game: activeGame,
    });
    return this.teamRepository.save(team);
  }
  createGame() {
    const game = this.gameRepository.create();
    return this.gameRepository.save(game);
  }
  createPlayer(playerData: Partial<Player>): Promise<Player> {
    const player = this.playerRepository.create(playerData);
    return this.playerRepository.save(player);
  }
  createEvent(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(eventData);
    return this.eventRepository.save(event);
  }
  createTakedown(takedownData: Partial<Takedown>): Promise<Takedown> {
    const takedown = this.takedownRepository.create(takedownData);
    return this.takedownRepository.save(takedown);
  }
  createPunishment(punishmentData: Partial<Punishment>): Promise<Punishment> {
    const punishment = this.punishmentRepository.create(punishmentData);
    return this.punishmentRepository.save(punishment);
  }
  async getChampion(summonerName: string, game: Game) {
    const champion = await this.championRepository
      .createQueryBuilder('champion')
      .leftJoin('champion.team', 'team')
      .where('champion.summonerName = :name', { name: summonerName })
      .andWhere('champion.team.game = :gameID', { gameID: game.gameId })
      .getOne();
    return champion;
  }
  setupPlayerRoster(game: Game): Game {
    //this will get a list of players with their names and teams after they have been selcted in the App
    return game;
  }

  filterNewEvents(
    inputNew: AllGameDataResponse,
    inputOld: AllGameDataResponse,
  ) {
    inputNew.events.Events = inputNew.events.Events.filter(
      (item) => !inputOld.events.Events.includes(item),
    );
    return inputNew;
  }
  async hasGameEnded(game: Game): Promise<boolean> {
    const endEvent = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.game = :gameID', { gameID: game.gameId })
      .andWhere('event.eventType =:eventType', { eventType: 'GameEnd' })
      .getOne();
    if (endEvent !== null) {
      return true;
    } else {
      return false;
    }
  }
}
