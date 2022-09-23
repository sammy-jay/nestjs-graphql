import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { Repository, In } from 'typeorm';
import { User, UserInput } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
  ) {}

  async findAll() {
    return await this.usersRepository.find({
      relations: ['teams'],
    });
  }

  async findById(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['teams'],
    });
  }
  async findByIds(ids: number[]) {
    return await this.usersRepository.find({
      where: { id: In(ids) },
      relations: ['teams'],
    });
  }

  async createUser(data: UserInput) {
    const user = await this.usersRepository.save(
      await this.usersRepository.create(data),
    );
    if (data.teamId) await this.teamsService.addMember(data.teamId, user.id);
    return user;
  }
}
