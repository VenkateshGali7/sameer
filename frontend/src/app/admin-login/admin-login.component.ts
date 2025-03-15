import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  apiError: string | null = null

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
   
    if (this.loginForm.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    const credentials:any = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password,
    }
    this.authService.adminLogin(credentials).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status) {
          localStorage.setItem('adminToken', res.token)
          this.router.navigate(['/admin/dashboard']);

        } else {
          this.apiError = res.message || "Login failed. Please try again."
        }
      },
      error: (error) => {
        this.loading = false
        if (error.error && error.error.message) {
          this.apiError = error.error.message
        } else if (error.status === 401) {
          this.apiError = "Invalid credentials. Please try again."
        } else {
          this.apiError = "An error occurred. Please try again later."
        }
        console.error("Login error:", error)
      },
    }
      
     
    );
    

    


    
  
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}