import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entity/team.entity';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), forwardRef(() => UsersModule)],
  providers: [TeamsService, TeamsResolver],
  exports: [TeamsService],
})
export class TeamsModule {}
