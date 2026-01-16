import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-account-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {
  viewDataInitialized: boolean = false;
  today: string = '';
  email: string = '';
  password: string = '********';
  name: string = '';
  iataCode: string = '';
  accountingCode: string = '';
  title: string = '';
  firstName: string = '';
  lastName: string = '';
  dateOfBirth: string = '';
  emailDisabled: boolean = true;
  passwordDisabled: boolean = true;
  nameDisabled: boolean = true;
  iataCodeDisabled: boolean = true;
  accountingCodeDisabled: boolean = true;
  titleDisabled: boolean = true;
  firstNameDisabled: boolean = true;
  lastNameDisabled: boolean = true;
  dateOfBirthDisabled: boolean = true;
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  nameErrorMessage: string = '';
  iataCodeErrorMessage: string = '';
  accountingCodeErrorMessage: string = '';
  titleErrorMessage: string = '';
  firstNameErrorMessage: string = '';
  lastNameErrorMessage: string = '';
  dateOfBirthErrorMessage: string = '';

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.today = new Date().toISOString().slice(0, 10);
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    //else if(this.auth.getUserType() === 'airline' && !this.auth.getCurrentUser()?.registrationCompleted)
    //  this.router.navigate(['/complete-registration']);
    else{
      const currentUser = this.auth.getCurrentUser();
      this.email = currentUser?.email || '';
      if(this.auth.getUserType() === 'airline'){
        this.name = currentUser?.name || '';
        this.iataCode = currentUser?.iataCode || '';
        this.accountingCode = currentUser?.accountingCode || '';
      }
      else if(this.auth.getUserType() === 'passenger'){
        this.title = currentUser?.title || '';
        this.firstName = currentUser?.firstName || '';
        this.lastName = currentUser?.lastName || '';
        this.dateOfBirth = currentUser?.dateOfBirth || '';
      }
      this.viewDataInitialized = true;
    }
  }
  
  getUserType() {
    return this.auth.getUserType();
  }

  enableEmail() {
    this.emailDisabled = false;
  }

  enablePassword() {
    this.passwordDisabled = false;
  }

  enableName() {
    this.nameDisabled = false;
  }

  enableIataCode() {
    this.iataCodeDisabled = false;
  }

  enableAccountingCode() {
    this.accountingCodeDisabled = false;
  }

  enableTitle() {
    this.titleDisabled = false;
  }

  enableFirstName() {
    this.firstNameDisabled = false;
  }

  enableLastName() {
    this.lastNameDisabled = false;
  }

  enableDateOfBirth() {
    this.dateOfBirthDisabled = false;
  }

  updateEmail(form: NgForm) {
    this.emailErrorMessage = '';
    if(!this.email)
      this.emailErrorMessage = 'Email is required';
    else if(!/^[a-z0-9._+-]{1,64}@[a-z0-9.-]{1,128}\.[a-z]{2,4}$/.test(this.email))
      this.emailErrorMessage = 'Invalid email format';
    if(!this.emailErrorMessage)
      this.updateUserDetails(form);
  }

  updateName(form: NgForm) {
    this.nameErrorMessage = '';
    if(!this.name)
      this.nameErrorMessage = 'Company name is required';
    else if(!/^(?=.{1,50}$)[A-Za-z0-9&.'\-]+(?: [A-Za-z0-9&.'\-]+)*$/.test(this.name))
      this.nameErrorMessage = 'Invalid or extra characters in company name';
    if(!this.nameErrorMessage)
      this.updateUserDetails(form);
  }

  updateIataCode(form: NgForm) {
    this.iataCodeErrorMessage = '';
    if(!this.iataCode)
      this.iataCodeErrorMessage = 'IATA code is required';
    else if(!/^[A-Z]{2}$/.test(this.iataCode))
      this.iataCodeErrorMessage = 'Invalid IATA code format';
    if(!this.iataCodeErrorMessage)
      this.updateUserDetails(form);
  }

  updateAccountingCode(form: NgForm) {
    this.accountingCodeErrorMessage = '';
    if(!this.accountingCode)
      this.accountingCodeErrorMessage = 'Accounting code is required';
    else if(!/^\d{3}$/.test(this.accountingCode))
      this.accountingCodeErrorMessage = 'Invalid accounting code format';
    if(!this.accountingCodeErrorMessage)
      this.updateUserDetails(form);
  }

  updateTitle(form: NgForm) {
    this.titleErrorMessage = '';
    if(!this.title)
      this.titleErrorMessage = 'Title is required';
    if(!this.titleErrorMessage)
      this.updateUserDetails(form);
  }

  updateFirstName(form: NgForm) {
    this.firstNameErrorMessage = '';
    if(!this.firstName)
      this.firstNameErrorMessage = 'First name is required';
    else if(!/^[A-Z][a-zA-Z' -]{0,49}$/.test(this.firstName))
      this.firstNameErrorMessage = 'Invalid or extra characters in first name';
    if(!this.firstNameErrorMessage)
      this.updateUserDetails(form);
  }

  updateLastName(form: NgForm) {
    this.lastNameErrorMessage = '';
    if(!this.lastName)
      this.lastNameErrorMessage = 'Last name is required';
    else if(!/^[A-Z][a-zA-Z' -]{0,49}$/.test(this.lastName))
      this.lastNameErrorMessage = 'Invalid or extra characters in last name';
    if(!this.lastNameErrorMessage)
      this.updateUserDetails(form);
  }

  updateDateOfBirth(form: NgForm) {
    this.dateOfBirthErrorMessage = '';
    if(!this.dateOfBirth)
      this.dateOfBirthErrorMessage = 'Date of birth is required';
    if(!this.dateOfBirthErrorMessage)
      this.updateUserDetails(form);
  }

  updatePassword(form: NgForm) {
    this.passwordErrorMessage = '';
    if(!this.password)
      this.passwordErrorMessage = 'Password is required';
    else if(!/^.{8,255}$/.test(this.password))
      this.passwordErrorMessage = 'Password must be 8+ characters';
    if(!this.passwordErrorMessage)
      this.updateUserDetails(form);
  }

  private updateUserDetails(form: NgForm) {
    this.api.updateUserDetails(this.auth.getUserId(), form.value).subscribe({
      next: () => this.router.navigate(['/account']),
      error: (err: HttpErrorResponse) => {
        if(err.status === 400){
          const message = err.error.messages[0];
          if(['Email already in use', 'Email already taken'].includes(message))
            this.emailErrorMessage = message;
          else if(['IATA code already in use', 'IATA code already taken'].includes(message))
            this.iataCodeErrorMessage = message;
          else if(['Accounting code already in use', 'Accounting code already taken'].includes(message))
            this.accountingCodeErrorMessage = message;
        }
        else if([401, 404].includes(err.status)){
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

  deleteAccount() {
    this.api.deleteUser(this.auth.getUserId()).subscribe({
      next: () => {
        this.auth.clearSession();
        this.router.navigate(['/booking']);
      },
      error: (err: HttpErrorResponse) => {
        if([401, 404].includes(err.status)){
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