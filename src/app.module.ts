import { ApolloDriver } from '@nestjs/apollo';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    forwardRef(() => TeamsModule),
    forwardRef(() => UsersModule),
  ],
})
export class AppModule {}
