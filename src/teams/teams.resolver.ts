import {
  Resolver,
  Int,
  Args,
  Parent,
  Query,
  Mutation,
  ResolveField,
} from '@nestjs/graphql';
import { Team, TeamInput } from 'src/teams/entity/team.entity';
import { User } from 'src/users/entity/user.entity';
import { TeamsService } from './teams.service';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => [Team], { name: 'teams', nullable: false })
  async getteams() {
    return await this.teamsService.findAll();
  }

  @Query(() => Team, { name: 'team', nullable: true })
  async getUserById(@Args({ name: 'id', type: () => Int }) id: number) {
    return await this.teamsService.findById(id);
  }

  @Mutation(() => Team, { name: 'createTeam' })
  async createUser(@Args('data') inputData: TeamInput) {
    return this.teamsService.createTeam(inputData);
  }

  @Mutation(() => Team)
  async addMember(
    @Args({ name: 'teamId', type: () => Int }) teamId: number,
    @Args({ name: 'userId', type: () => Int }) userId: number,
  ) {
    return this.teamsService.addMember(teamId, userId);
  }

  @Mutation(() => Team)
  async removeMember(
    @Args({ name: 'teamId', type: () => Int }) teamId: number,
    @Args({ name: 'userId', type: () => Int }) userId: number,
  ) {
    return this.teamsService.removeMember(teamId, userId);
  }

  @ResolveField('members', () => [User], { nullable: false })
  async getTeams(@Parent() team: Team) {
    return await team.members;
  }
}
