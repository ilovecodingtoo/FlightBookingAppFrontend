import { Component, OnInit } from '@angular/core';
import { Flight } from '../../models/flight.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Aircraft } from '../../models/aircraft.model';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-flight-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.css'
})
export class FlightListComponent implements OnInit {
  viewDataInitialized: boolean = false;
  now: string = '';
  flights: Flight[] = [];
  aircrafts: Aircraft[] = [];
  origins: string[] = [];
  destinations: string[] = [];
  codeErrorMessage: string = '';
  aircraftIdErrorMessage: string = '';
  originErrorMessage: string = '';
  destinationErrorMessage: string = '';
  departureErrorMessage: string = '';
  arrivalErrorMessage: string = '';
  economyPriceErrorMessage: string = '';
  businessPriceErrorMessage: string = '';
  firstClassPriceErrorMessage: string = '';
  extraBaggagePriceErrorMessage: string = '';
  extraLegroomPriceErrorMessage: string = '';
  priorityBoardingPriceErrorMessage: string = '';

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.now = new Date().toISOString().slice(0, 16);
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    else if(this.auth.getUserType() === 'passenger')
      this.router.navigate(['/403']);
    //else if(this.auth.getUserType() === 'airline' && !this.auth.getCurrentUser()?.registrationCompleted)
    //  this.router.navigate(['/complete-registration']);
    else{
      forkJoin({
        flights: this.api.getFlights(),
        aircrafts: this.api.getAircrafts(),
        cities: this.api.getCities()
      }).subscribe({
        next: ({ flights, aircrafts, cities }) => {
          this.flights = flights;
          this.aircrafts = aircrafts;
          this.origins = cities.origins;
          this.destinations = cities.destinations;
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

  addFlight(form: NgForm) {
    this.codeErrorMessage = this.aircraftIdErrorMessage = this.originErrorMessage = this.destinationErrorMessage = this.departureErrorMessage = this.arrivalErrorMessage = this.economyPriceErrorMessage = this.businessPriceErrorMessage = this.firstClassPriceErrorMessage = this.extraBaggagePriceErrorMessage = this.extraLegroomPriceErrorMessage = this.priorityBoardingPriceErrorMessage = '';
    const code = form.value.code;
    const aircraftId = form.value.aircraftId;
    const origin = form.value.origin;
    const destination = form.value.destination;
    const departure = form.value.departure;
    const arrival = form.value.arrival;
    const economyPrice = form.value.economyPrice;
    const businessPrice = form.value.businessPrice;
    const firstClassPrice = form.value.firstClassPrice;
    const extraBaggagePrice = form.value.extraBaggagePrice;
    const extraLegroomPrice = form.value.extraLegroomPrice;
    const priorityBoardingPrice = form.value.priorityBoardingPrice;
    if(!code)
      this.codeErrorMessage = 'Code is required';
    else if(!/^[A-Z]{2}[0-9]{3,4}$/.test(code))
      this.codeErrorMessage = 'Invalid code format';
    if(!aircraftId)
      this.aircraftIdErrorMessage = 'Aircraft is required';
    if(!origin)
      this.originErrorMessage = 'Origin is required';
    else if(!/^(?=.{1,50}$)[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/.test(origin))
      this.originErrorMessage = 'Invalid or extra characters in origin';
    if(!destination)
      this.destinationErrorMessage = 'Destination is required';
    else if(!/^(?=.{1,50}$)[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/.test(destination))
      this.destinationErrorMessage = 'Invalid or extra characters in destination';
    else if(origin === destination)
      this.destinationErrorMessage = 'Destination must be different than origin';
    if(!departure)
      this.departureErrorMessage = 'Departure date is required';
    if(!arrival)
      this.arrivalErrorMessage = 'Arrival date is required';
    else if(departure && new Date(arrival) <= new Date(departure))
      this.arrivalErrorMessage = 'Arrival date must be after departure date';
    if(!economyPrice)
      this.economyPriceErrorMessage = 'Economy price is required';
    else if(!/^\d+(\.\d{1,2})?$/.test(economyPrice))
      this.economyPriceErrorMessage = 'Economy price must be a positive decimal number';
    if(!businessPrice)
      this.businessPriceErrorMessage = 'Business price is required';
    else if(!/^\d+(\.\d{1,2})?$/.test(businessPrice))
      this.businessPriceErrorMessage = 'Business price must be a positive decimal number';
    if(!firstClassPrice)
      this.firstClassPriceErrorMessage = 'First class price is required';
    else if(!/^\d+(\.\d{1,2})?$/.test(firstClassPrice))
      this.firstClassPriceErrorMessage = 'First class price must be a positive decimal number';
    if(!extraBaggagePrice)
      this.extraBaggagePriceErrorMessage = 'Extra baggage price is required';
    else if(!/^\d+(\.\d{1,2})?$/.test(extraBaggagePrice))
      this.extraBaggagePriceErrorMessage = 'Extra baggage price must be a positive decimal number';
    if(!extraLegroomPrice)
      this.extraLegroomPriceErrorMessage = 'Extra legroom price is required';
    else if(!/^\d+(\.\d{1,2})?$/.test(extraLegroomPrice))
      this.extraLegroomPriceErrorMessage = 'Extra legroom price must be a positive decimal number';
    if(!priorityBoardingPrice)
      this.priorityBoardingPriceErrorMessage = 'Priority boarding price is required';
    else if(!/^\d+(\.\d{1,2})?$/.test(priorityBoardingPrice))
      this.priorityBoardingPriceErrorMessage = 'Priority boarding price must be a positive decimal number';
    if(!this.codeErrorMessage && !this.aircraftIdErrorMessage && !this.originErrorMessage && !this.destinationErrorMessage && !this.departureErrorMessage && !this.arrivalErrorMessage && !this.economyPriceErrorMessage && !this.businessPriceErrorMessage && !this.firstClassPriceErrorMessage && !this.extraBaggagePriceErrorMessage && !this.extraLegroomPriceErrorMessage && !this.priorityBoardingPriceErrorMessage){
      this.api.addFlight(form.value).subscribe({
      next: () => this.router.navigate(['/flights']),
      error: (err: HttpErrorResponse) => {
          if(err.status === 400){
            for(let message of err.error.messages)
              if(['Invalid code format', 'Code already taken'].includes(message))
                this.codeErrorMessage = message;
              else if(['Unavailable aircraft', 'Aircraft already scheduled on selected dates'].includes(message))
                this.aircraftIdErrorMessage = message;
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