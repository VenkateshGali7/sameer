import { Component, OnInit } from '@angular/core';
// import { authService } from './reward.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  rewardPoints: number = 0;
  transactions: any[] = [];

  isLoading: boolean = true; // To show a loading spinner while data is fetched
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchDashboardDetails();
  }

  fetchDashboardDetails(): void {
    const phoneNumber = localStorage.getItem('phoneNumber');
  
    if (!phoneNumber) {
      this.errorMessage = 'Phone number is missing. Please log in again.';
      return;
    }
  
    this.isLoading = true;
  
    this.authService.getUserDashboard(phoneNumber).subscribe(
      (data) => {
        this.rewardPoints = data.totalRewardPoints;
        this.transactions = data.transactions
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch dashboard details.';
        console.error(error);
        this.isLoading = false;
      }
    );
  }
  
  
}
