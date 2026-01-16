import { Component, OnInit } from '@angular/core';
import { Aircraft } from '../../models/aircraft.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-aircraft-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './aircraft-list.component.html',
  styleUrl: './aircraft-list.component.css'
})
export class AircraftListComponent implements OnInit {
  viewDataInitialized: boolean = false;
  aircrafts: Aircraft[] = [];
  tailNumberErrorMessage: string = '';
  modelErrorMessage: string = '';
  seatingCapacityErrorMessage: string = '';

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    else if(this.auth.getUserType() === 'passenger')
      this.router.navigate(['/403']);
    //else if(this.auth.getUserType() === 'airline' && !this.auth.getCurrentUser()?.registrationCompleted)
    //  this.router.navigate(['/complete-registration']);
    else{
      this.api.getAircrafts().subscribe({
        next: (aircrafts: Aircraft[]) => {
          this.aircrafts = aircrafts;
          this.viewDataInitialized = true;
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 401){
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

  getUserType() {
    return this.auth.getUserType();
  }

  addAircraft(form: NgForm) {
    this.tailNumberErrorMessage = this.modelErrorMessage = this.seatingCapacityErrorMessage = '';
    const tailNumber = form.value.tailNumber;
    const model = form.value.model;
    const seatingCapacity = form.value.seatingCapacity;
    if(!tailNumber)
      this.tailNumberErrorMessage = 'Tail number is required';
    else if(!/^[A-Z]-?[A-Z0-9]{4}$/.test(tailNumber))
      this.tailNumberErrorMessage = 'Invalid tail number format';
    if(!model)
      this.modelErrorMessage = 'Model is required';
    else if(!/^[A-Z][a-zA-Z0-9\- ]{0,49}$/.test(model))
      this.modelErrorMessage = 'Invalid or extra characters in model';
    if(!seatingCapacity)
      this.seatingCapacityErrorMessage = 'Seating capacity is required';
    else if(!/^[1-9]\d*$/.test(seatingCapacity))
      this.seatingCapacityErrorMessage = 'Seating capacity must be a positive integer';
    if(!this.tailNumberErrorMessage && !this.modelErrorMessage && !this.seatingCapacityErrorMessage){
      this.api.addAircraft(form.value).subscribe({
        next: () => this.router.navigate(['/aircrafts']),
        error: (err: HttpErrorResponse) => {
          if(err.status === 400){
            for(let message of err.error.messages)
              if(message === 'Tail number already taken')
                this.tailNumberErrorMessage = message;
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