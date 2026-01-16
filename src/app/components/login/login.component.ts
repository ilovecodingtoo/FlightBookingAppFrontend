import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  login(form: NgForm) {
    this.emailErrorMessage = this.passwordErrorMessage = '';
    const email = form.value.email;
    const password = form.value.password;
    if(!email)
      this.emailErrorMessage = 'Email is required';
    else if(!/^[a-z0-9._+-]{1,64}@[a-z0-9.-]{1,128}\.[a-z]{2,4}$/.test(email))
      this.emailErrorMessage = 'Invalid email format';
    if(!password)
      this.passwordErrorMessage = 'Password is required';
    if(!this.emailErrorMessage && !this.passwordErrorMessage){
      this.api.login(form.value).subscribe({
        next: () => {
          //if(this.auth.getUserType() === 'airline' && !this.auth.getCurrentUser()?.registrationCompleted)
          //  this.router.navigate(['/complete-registration']);
          //else
            this.router.navigate(['/booking']);
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 400){
            for(let message of err.error.messages)
              if(message === 'Email not registered')
                this.emailErrorMessage = message;
              else if(message === 'Incorrect password')
                this.passwordErrorMessage = message;
          }
          else if(err.status === 401){
            this.auth.clearSession();
            this.router.navigate(['/401']);
          }
          else if(err.status === 403)
            this.router.navigate(['/403']);
          else
            this.router.navigate(['/500']);
        }
      });
    }
  }
}