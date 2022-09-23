import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType, InputType, Int } from '@nestjs/graphql';
import { User } from 'src/users/entity/user.entity';

@Entity('teams')
@ObjectType()
export class Team {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field({ nullable: false })
  name: string;

  @ManyToMany(() => User, (user: User) => user.teams)
  @JoinTable()
  @Field(() => [User], { nullable: true })
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@InputType()
export class TeamInput {
  @Field({ nullable: false })
  name: string;
}
