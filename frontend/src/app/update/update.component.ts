import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  formData = {
    date: '',
    amount: '',
    product: '',
    transactionId: '',
    User: {
      phoneNumber: ''
    }
  };
  

  productOptions = ['Petrol', 'Diesel', 'XP96', 'CNG', 'WASH', 'CAFE'];

  constructor(private authService: AuthService) {}

  resetForm(): void {
    this.formData = {
      date: '',
      amount: '',
      product: '',
      transactionId: '',
      User: {
        phoneNumber: localStorage.getItem('phoneNumber') || ''
      }
    };
  }
  

  onSubmit(): void {
    const phoneNumber = localStorage.getItem('phoneNumber');
    
    if (!phoneNumber) {
      alert('Phone number is missing. Please log in again.');
      return;
    }
  
    this.formData.User = { phoneNumber };
  
    console.log('Form Data Before Sending:', this.formData);
  
    if (this.formData.date && this.formData.amount && this.formData.product && this.formData.transactionId && this.formData.User.phoneNumber) {
      this.authService.saveTransaction(this.formData).subscribe(
        (response) => {
          console.log('Transaction saved successfully:', response);
          alert('Transaction saved successfully!');
          this.resetForm();
        },
        (error) => {
          console.error('Error saving transaction:', error);
          alert('Failed to save transaction.');
        }
      );
    } else {
      alert('Please fill all fields before submitting!');
      console.log('Missing fields:', this.formData);
    }
  }
  
  
}
