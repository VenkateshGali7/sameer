import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {
  constructor(private authService: AuthService, private router: Router) {}

  navigateToView() {
    // Navigate to the view page
    this.router.navigate(['/view']);
  }

  navigateToUpdate() {
    // Navigate to the update page
    this.router.navigate(['/update']);
  }

  onUpdateClick() {
    this.router.navigate(['/update']);
  }

  onViewClick() {
    this.router.navigate(['/view']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
