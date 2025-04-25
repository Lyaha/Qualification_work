import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { User } from '../entity/user.entity';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: 5432,
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'warehouse_db',
        entities: [User],
        synchronize: false, // true тільки в dev-режимі
        autoLoadEntities: true,
      }),
      UsersModule,
    ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
