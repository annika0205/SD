import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';

interface AuthForm {
  username: string;
  password: string;
  confirmPassword?: string;
  email?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showLoginForm = false;
  isRegistering = false;
  errorMessage = '';

  authForm: AuthForm = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  };

  onSubmit() {
    if (this.isRegistering) {
      this.register();
    } else {
      this.login();
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateHome() {
    this.router.navigate(['/']);
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    if (!this.showLoginForm) {
      this.isRegistering = false; 
      this.errorMessage = '';
    }
  }

  toggleRegisterMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    // Reset form when switching modes
    this.authForm = {
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    };
  }


  login() {
    this.authService.login(this.authForm.username, this.authForm.password).subscribe({
      next: () => {
        this.showLoginForm = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed';
      }
    });
  }

 
  register() {
    if (this.authForm.password !== this.authForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    if (!this.authForm.email) {
      this.errorMessage = 'Email is required';
      return;
    }

    this.authService.register(
      this.authForm.username, 
      this.authForm.password, 
      this.authForm.email
    ).subscribe({
      next: () => {
        this.showLoginForm = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed';
      }
    });
  }
}
