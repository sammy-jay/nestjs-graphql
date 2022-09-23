import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { Team, TeamInput } from './entity/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamsRepository: Repository<Team>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.teamsRepository.find({
      relations: ['members'],
    });
  }

  async findById(id: number) {
    return await this.teamsRepository.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async findByIds(ids: number[]) {
    return await this.teamsRepository.find({
      where: { id: In(ids) },
      relations: ['members'],
    });
  }

  async createTeam(data: TeamInput) {
    const team = await this.teamsRepository.create(data);
    return await this.teamsRepository.save(team);
  }

  async addMember(teamId: number, userId: number) {
    const team = await this.findById(teamId);
    if (!team)
      throw new BadRequestException('Team with id ' + teamId + ' not found');

    const user = await this.usersService.findById(userId);
    if (!user)
      throw new BadRequestException('Team with id ' + teamId + ' not found');

    (await team.members).push(user);
    await this.teamsRepository.save(team);

    return team;
  }

  async removeMember(teamId: number, userId: number) {
    const team = await this.findById(teamId);
    if (!team)
      throw new BadRequestException('Team with id ' + teamId + ' not found');
    const members = await team.members;

    const index = members.findIndex((member) => member.id === userId);

    if (index >= 0) {
      members.splice(index, 1);
      await this.teamsRepository.save(team);
    }

    return team;
  }
}
