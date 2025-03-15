import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  phoneNumber: string = '';
  dob: Date = new Date()
  otp: string = '';
  otpSent: boolean = false;
  user: boolean = false;
  message: string = '';
  // phoneNumber: string = '';
  invalidOtp: boolean = false;
  isPhoneNumberValid: boolean = true;
  dobInvalid : boolean = false

  constructor(private authService: AuthService, private router: Router) {}

  // onSubmit() {
  //   const formattedPhoneNumber = this.phoneNumber.startsWith('+91') 
  //     ? this.phoneNumber 
  //     : `+91${this.phoneNumber}`;
  //   if (this.otpSent) {
  //     console.log("not coming here");     
  //     this.authService.verifyOtp(formattedPhoneNumber, this.otp).subscribe(
  //       (res: any) => {
  //         if (res.success) {
  //           localStorage.setItem('authToken', res.token); // Store token
  //           this.message = res.message;
  //           this.router.navigate(['/home']); // Redirect to home
  //         } else {
  //           this.message = 'OTP verification failed.';
  //         }
  //       },
  //       () => (this.message = 'Error verifying OTP'),
  //     );
  //   } else {
  //     console.log("coming heere");
      
  //     this.authService.sendOtp(formattedPhoneNumber).subscribe(
  //       () => {
  //         this.otpSent = true;
  //         this.message = 'OTP sent to your phone.';
  //       },
  //       () => (this.message = 'Error sending OTP'),
  //     );
  //   }
  // }


  sendOtp(): void {
    console.log('send otp function triggered.....')
    if (this.isPhoneNumberValid && this.phoneNumber) {
      this.authService.sendOtp(this.phoneNumber).subscribe(
        (res) => {
          if (res.success && res.flag_value == 1) {
            this.otpSent = true;
            this.message = 'OTP sent successfully!';
            this.user = false;
          }
          else{
            this.otpSent = true;
            this.message = 'OTP sent successfully!';
            this.user = true;
          }
        },
        (error) => {
          console.error('Error sending OTP:', error);
          this.message = 'Failed to send OTP. Please try again.';
        }
      );
    } else {
      this.message = 'Invalid phone number. Please enter a valid number.';
    }
  }
  verifyOtp() {
    const formattedPhoneNumber = this.phoneNumber.startsWith('+91') 
      ? this.phoneNumber 
      : `+91${this.phoneNumber}`;
    this.authService.verifyOtp(formattedPhoneNumber, this.otp, this.dob).subscribe(
      (res) => {
        if (res.success) {
          localStorage.setItem('phoneNumber', this.phoneNumber);
          localStorage.setItem('authToken', res.token);
          this.router.navigate(['/home']);
        } else {
          this.invalidOtp = true;
          this.message = 'Invalid OTP. Please try again.';
        }
      },
      () => {
        this.invalidOtp = true;
        this.message = 'Error verifying OTP. Please try again.';
      }
    );
  }
  validateNumericInput(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }

  // Validate the phone number format
  validatePhoneNumber(): void {
    const phoneRegex = /^[789]\d{9}$/;
    this.isPhoneNumberValid = phoneRegex.test(this.phoneNumber);
  }
}
