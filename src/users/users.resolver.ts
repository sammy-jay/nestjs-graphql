import {
  Resolver,
  Int,
  Args,
  Parent,
  Query,
  Mutation,
  ResolveField,
} from '@nestjs/graphql';
import { User, UserInput } from './entity/user.entity';
import { UsersService } from './users.service';
import { Team } from 'src/teams/entity/team.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users', nullable: false })
  async getUsers() {
    return await this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUserById(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.usersService.findById(id);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('data') inputData: UserInput) {
    return this.usersService.createUser(inputData);
  }

  @ResolveField('teams', () => [Team], { nullable: false })
  async getTeams(@Parent() user: User) {
    return await user.teams;
  }
}
