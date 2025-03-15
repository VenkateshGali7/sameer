import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { Transaction } from '../entities/transaction.entity';
import { Reward } from '../entities/reward.entity';
import { Admin } from 'src/entities/admin.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { log } from 'console';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private sns: AWS.SNS;
  flag: any;
  private otpStore: Map<string, string> = new Map(); // Temporary OTP storage

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private configService: ConfigService) {
    this.sns = new AWS.SNS({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
  }

  sendOtp(phoneNumber: string): Observable<any> {
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp, 'this is otp')
    this.otpStore.set(formattedPhoneNumber, otp);
  
    console.log('Generated OTP:', otp, 'for', formattedPhoneNumber);
  
    return new Observable((observer) => {
      this.findUserByPhoneNumber(phoneNumber).then((user_check) => {
        const flag = user_check ? 1 : 0;
        console.log("sssssssssssssssssss",flag);
        
        const params = {
          Message: `Your OTP is: ${otp}`,
          PhoneNumber: formattedPhoneNumber,
        };
  
        this.sns.publish(params, (err, data) => {
          if (err) {
            this.logger.error('Failed to send OTP:', err);
            observer.error(err);
          } else {
            this.logger.log(`OTP sent to ${formattedPhoneNumber}`);
            console.log("User check result (flag):", flag);
  
            observer.next({ success: true, flag_value: flag, messageId: data.MessageId });
            observer.complete();
          }
        });
      }).catch((error) => {
        this.logger.error('Error checking user:', error);
        observer.error(error);
      });
    });
  }
  

  // verifyOtp(phoneNumber: string, otp: string) {
  //   if (this.otpStore.get(phoneNumber) !== otp) {
  //     throw new BadRequestException('Invalid OTP');
  //   }
  //   this.otpStore.delete(phoneNumber);

  //   if (!process.env.JWT_SECRET) {
  //     throw new Error('JWT_SECRET is not defined');
  //   }

  //   const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

  //   return { success: true, message: 'OTP verified successfully', token };
  // }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone_number: phoneNumber } });
  }

  async verifyOtp(phoneNumber: string, otp: string, dob: Date) {
    if (this.otpStore.get(phoneNumber) !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    this.otpStore.delete(phoneNumber);
  
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    const normalizedPhoneNumber = this.normalizePhoneNumber(phoneNumber);
    let user = await this.findUserByPhoneNumber(normalizedPhoneNumber);

    if (!user) {

      console.log("not commmmm");
      
      try {
        const formattedDob = new Date(dob).toISOString().split('T')[0];
        console.log('Creating new user:', normalizedPhoneNumber,formattedDob);
        const userEntity = this.userRepository.create({
          phone_number: normalizedPhoneNumber,
          dateofbirth: formattedDob,
        });
        
        console.log('Creating new user:', userEntity);
        await this.userRepository.save(userEntity);

       
        console.log('New user created:', user);
      } catch (error) {
        if (error.code === '23505') {
          console.warn('User already exists with this phone number.');
          user = await this.findUserByPhoneNumber(normalizedPhoneNumber);
        } else {
          throw error;
        }
      }
    }

    
  
    // const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign(
      { phoneNumber: phoneNumber }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  
    return { success: true, message: 'OTP verified successfully', token, user };
  }
  
  
  normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/^\+91/, '');
  }
  

  async saveTransaction(data: any) {
    console.log('Received data:', data);
  
    if (!data || !data.transaction || !data.User || !data.User.phoneNumber) {
      throw new BadRequestException('User phone number is missing!');
    }

    // const foundUser = await this.findUserByPhoneNumber(data.User.phoneNumber);
    const foundUser = await this.findUserByPhoneNumber(data.transaction.User.phoneNumber);
    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }


  
    console.log('data.User.phoneNumber:', data.User.phoneNumber, data, data.User);
  
    const date = new Date(data.transaction.date);
  
    const transactionEntity = this.transactionRepository.create({
      date,
      amount: data.transaction.amount,
      product: data.transaction.product,
      transactionId: data.transaction.transactionId,
      points: this.calculatePoints(data.transaction.product, data.transaction.amount),
      user: foundUser,
      // phone_number: data.User.phoneNumber
    });

    // const transactionEntity = this.transactionRepository.create({
    //   date: new Date(),
    //   amount: 100,
    //   product: 'Petrol',
    //   transactionId: 'TXN12345',
    //   points: 10,
    //   user: foundUser,               // User entity
    //   phone_number: foundUser.phone_number,  // Direct phone number
    // });
    
  
    await this.transactionRepository.save(transactionEntity);
  
    return { message: 'Transaction saved successfully!', transaction: transactionEntity };
  }
  
  
  

  calculatePoints(product: string, amount: number): number {
    if (['Petrol', 'Diesel'].includes(product)) {
      return parseFloat(((amount / 100) * 1.33).toFixed(2));
    }
    return 0;
  }

  calculateReward(totalPoints: number): number {
    if (totalPoints >= 167) {
      return Math.floor(totalPoints / 167) * 50;
    }
    return 0;
  }

  async findUserById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId }, relations: ['transactions'] });
  }

  async getAllTransactions() {
    const transactions = await this.transactionRepository.find({
      relations: ['user'], // Include related user info
    });
    return transactions;
  }

  async getUserDashboard(phoneNumber: string) {
    // Fetch reward points
    const rewards = await this.transactionRepository.find({ 
      where: {
        user: {
          phone_number: phoneNumber,
        },
      },
      relations: ['user'], // Load the user relation to access phone_number
    });
    
    if (!rewards || rewards.length === 0) {
      throw new NotFoundException('No transactions found for this phone number');
    }
    
    const totalRewardPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);

    const transactions = rewards.map((reward) => ({
      rewardDate: reward.date,
      rewardAmount: reward.amount,
      rewardPoints: reward.points,
    }));
    
    return {
      phoneNumber,
      totalRewardPoints,
      transactions,
    };
    
    
    
  }



  async createAdmin(email:string, password:string){
    
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const existingAdmin = await this.adminRepository.findOne({ where: { email:email } });
    if (existingAdmin) {
      throw new BadRequestException('Admin with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, 'this is hased pasword,......... ')
    const newAdmin =  this.adminRepository.create({
      email : email,
      password : hashedPassword
    });

 
  return await this.adminRepository.save(newAdmin);
  }
  
  async adminLogin(body: { email: string; password: string }){
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }
  
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials.');
    }
  
    const secretKey = process.env.JWT_SECRET || 'Venkatesh'
    const accessToken = jwt.sign({ id: admin.id, email: admin.email }, secretKey, {
      expiresIn: '1h',
    });
  
    return { 
      "status" : true, 
      "token" : accessToken
     };
  }

  async userTransactionDetails() {
    const users = await this.userRepository.find({
      relations: ['transactions'], 
    });

    const data = users.map((user) => {
      console.log(user, 'this is user'); 
      return {
        id: user.id,
        phoneNumber: user.phone_number,
        transactions: user.transactions.map((trx) => ({
          id: trx.transactionId,
          date: trx.date.toISOString().split('T')[0], 
          amount: trx.amount, 
          product: trx.product,
          points: trx.points,
        })),
      };
    });
    return {
      status : true,
      data : data
    }
  }
  

  
}
