import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private otpStore = new Map<string, string>();
  private baseUrl = `${environment.SC_BE_HOST}/auth`; // Common base path

  constructor(private httpClient: HttpClient) {}

  sendOtp(phoneNumber: string): Observable<any> {
    console.log("Sending OTP to:", phoneNumber);
    return this.httpClient.post(`${this.baseUrl}/send-otp`, { phoneNumber });
  }

  adminLogin(credentials:{email:string, password:string}): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/admin/login`, { email : credentials.email, password : credentials.password });
  }

  verifyOtp(phoneNumber: string, otp: string, dob: Date): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/verify-otp`, { phoneNumber, otp, dob });
  }

  updateData(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/update`, data);
  }

  getUserDashboard(phoneNumber: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/dashboard/${phoneNumber}`);
  }
  
  

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  adminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  logout() {
    localStorage.removeItem('authToken'); // Clear the token
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Check if token exists
  }


  saveTransaction(transaction: any): Observable<any> {
    console.log("aaaaaaaaaaaaaaaaaaaaaa",transaction)
    return this.httpClient.post(`${this.baseUrl}/transaction`, { transaction });
  }

  fetchTransactions(){
    return this.httpClient.get(`${this.baseUrl}/user-transactions`,)
  }
}
