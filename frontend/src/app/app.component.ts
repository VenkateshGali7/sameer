import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',  // Router-outlet to display routed components
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Redirect to login page when the app initializes
    // this.router.navigate(['/login']);
  }
}
