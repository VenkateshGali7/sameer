import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  product: string;
  points: number;
}

interface User {
  id: number;
  name: string;
  phoneNumber: string;
  transactions: Transaction[];
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];

  expandedUsers: { [key: number]: boolean } = {};

  constructor(private router: Router, private authService: AuthService,) { }

  ngOnInit(): void {
    this.fetchTransactions()
    this.users.forEach(user => {
      this.expandedUsers[user.id] = false;
    });
  }

  toggleAccordion(userId: number): void {
    this.expandedUsers[userId] = !this.expandedUsers[userId];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  logout(): void {
    this.router.navigate(['/admin/login']);
    localStorage.removeItem('adminToken')

  }


  fetchTransactions(): void {
    this.authService.fetchTransactions().subscribe(
      (res:any) =>{
        if(res.status){
          this.users = res.data
        }
        else{

        }


      }
     
    );
    

    


    
  
  }

}