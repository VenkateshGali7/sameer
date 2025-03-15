import {  Controller, Post, Body, Get, Param, UseGuards, Request, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   login(@Body() createUserDto: CreateUserDto) {
//     return this.authService.login(createUserDto);
//   }

    @Post('send-otp')
    sendOtp(@Body('phoneNumber') phoneNumber: string): Observable<any> {
    if (!phoneNumber) throw new BadRequestException('Phone number is required');
    return this.authService.sendOtp(phoneNumber);
    }
    
    @Post('verify-otp')
    verifyOtp(@Body() body: { phoneNumber: string; otp: string, dob: Date }) {
        const { phoneNumber, otp, dob } = body;
        console.log(body, 'this is body')
        if (!phoneNumber || !otp) throw new BadRequestException('Phone number and OTP are required');
        return this.authService.verifyOtp(phoneNumber, otp, dob);
    }

    @UseGuards(JwtAuthGuard)
    @Post('transaction')
    saveTransaction(@Body() data: any, @Request() req: any) {
      console.log('User from JWT:', req.user); // Check if phoneNumber appears here

      if (!req.user?.phoneNumber) {
        throw new BadRequestException('User phone number is missing in the token!');
      }

      // Attach phoneNumber to the data object
      data.User = { phoneNumber: req.user.phoneNumber };

      return this.authService.saveTransaction(data);
    }

  
    @UseGuards(JwtAuthGuard)
    @Get('dashboard/:phoneNumber')
    async getUserDashboard(@Param('phoneNumber') phoneNumber: string) {
      return this.authService.getUserDashboard(phoneNumber);
    }


  //   @UseGuards(JwtAuthGuard)
  //   @Post('transaction')
  //   async createTransaction(@Request() req, @Body() body: any) {
  //     const userId = req.user.userId;
  //     return this.authService.createTransaction(userId, body.amount, body.type);
  // }


  @Post('create-admin')
 async createAdmin(@Body() body: { email: string; password: string; key: string }) {
    const { email, password, key } = body;
    const adminKey = process.env.ADMIN_KEY
    if (!email || !password || !key) {
      throw new BadRequestException('Email, password, and key are required.');
    }
    if(adminKey !== key){
      throw new UnauthorizedException("Unauthorized")
    }
    return await this.authService.createAdmin(email, password);
  }

  @Post('admin/login')
  async AdminLogin(@Body() body: { email: string; password: string; }) {
     const { email, password } = body;
     if (!email || !password) {
       throw new BadRequestException('Email, password are required.');
     }
     return await this.authService.adminLogin(body);
   }


   @Get('user-transactions')
   async userTransactiondetails() {
      return await this.authService.userTransactionDetails();
    }


  
}
