import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Reward } from './entities/reward.entity';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Transaction, Reward,Admin],
      synchronize: true, // Auto-create tables (disable in prod)
    }),
    AuthModule,
  ],
})
export class AppModule {}
