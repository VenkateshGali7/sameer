import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from '../entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Reward } from 'src/entities/reward.entity';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Transaction, User, Reward,Admin]), // Register entities here
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // JWT module only needs ConfigModule
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
