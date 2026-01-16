import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-signup',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  viewDataInitialized: boolean = false;
  today: string = '';
  userType = 'passenger';
  emailErrorMessage: string = '';
  nameErrorMessage: string = '';
  iataCodeErrorMessage: string = '';
  accountingCodeErrorMessage: string = '';
  titleErrorMessage: string = '';
  firstNameErrorMessage: string = '';
  lastNameErrorMessage: string = '';
  dateOfBirthErrorMessage: string = '';
  passwordErrorMessage: string = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
    this.viewDataInitialized = true;
  }

  clearErrorMessages() {
    this.emailErrorMessage = this.nameErrorMessage = this.iataCodeErrorMessage = this.accountingCodeErrorMessage = this.titleErrorMessage = this.firstNameErrorMessage = this.lastNameErrorMessage = this.dateOfBirthErrorMessage = this.passwordErrorMessage = '';
  }

  signup(form: NgForm) {
    this.clearErrorMessages();
    const email = form.value.email;
    const password = form.value.password;
    if(!email)
      this.emailErrorMessage = 'Email is required';
    else if(!/^[a-z0-9._+-]{1,64}@[a-z0-9.-]{1,128}\.[a-z]{2,4}$/.test(email))
      this.emailErrorMessage = 'Invalid email format';
    if(!password)
      this.passwordErrorMessage = 'Password is required';
    else if(!/^.{8,255}$/.test(password))
      this.passwordErrorMessage = 'Password must be 8+ characters';
    if(this.userType === 'airline'){
      const name = form.value.name;
      const iataCode = form.value.iataCode;
      const accountingCode = form.value.accountingCode;
      if(!name)
        this.nameErrorMessage = 'Company name is required';
      else if(!/^(?=.{1,50}$)[A-Za-z0-9&.'\-]+(?: [A-Za-z0-9&.'\-]+)*$/.test(name))
        this.nameErrorMessage = 'Invalid or extra characters in company name';
      if(!iataCode)
        this.iataCodeErrorMessage = 'IATA code is required';
      else if(!/^[A-Z]{2}$/.test(iataCode))
        this.iataCodeErrorMessage = 'Invalid IATA code format';
      if(!accountingCode)
        this.accountingCodeErrorMessage = 'Accounting code is required';
      else if(!/^\d{3}$/.test(accountingCode))
        this.accountingCodeErrorMessage = 'Invalid accounting code format';
      if(!this.emailErrorMessage && !this.passwordErrorMessage && !this.nameErrorMessage && !this.iataCodeErrorMessage && !this.accountingCodeErrorMessage){
        this.api.registerAirline(form.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err: HttpErrorResponse) => {
            if(err.status === 400){
              for(let message of err.error.messages)
                if(message === 'Email already taken')
                  this.emailErrorMessage = message;
                else if(message === 'IATA code already taken')
                  this.iataCodeErrorMessage = message;
                else if(message === 'Accounting code already taken')
                  this.accountingCodeErrorMessage = message;
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
    else{
      const title = form.value.title;
      const firstName = form.value.firstName;
      const lastName = form.value.lastName;
      const dateOfBirth = form.value.dateOfBirth;
      if(!title)
        this.titleErrorMessage = 'Title is required';
      if(!firstName)
        this.firstNameErrorMessage = 'First name is required';
      else if(!/^[A-Z][a-zA-Z' -]{0,49}$/.test(firstName))
        this.firstNameErrorMessage = 'Invalid or extra characters in first name';
      if(!lastName)
        this.lastNameErrorMessage = 'Last name is required';
      else if(!/^[A-Z][a-zA-Z' -]{0,49}$/.test(lastName))
        this.lastNameErrorMessage = 'Invalid or extra characters in last name';
      if(!dateOfBirth)
        this.dateOfBirthErrorMessage = 'Date of birth is required';
      if(!this.emailErrorMessage && !this.passwordErrorMessage && !this.titleErrorMessage && !this.firstNameErrorMessage && !this.lastNameErrorMessage && !this.dateOfBirthErrorMessage){
        this.api.registerPassenger(form.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err: HttpErrorResponse) => {
            if(err.status === 400){
              for(let message of err.error.messages)
                if(message === 'Email already taken')
                  this.emailErrorMessage = message;
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
}