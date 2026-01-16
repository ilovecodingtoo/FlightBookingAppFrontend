import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { OriginDestination } from '../../models/origin-destination.model';
import { TripSearchResult } from '../../models/trip-search-result.model';
import { Flight } from '../../models/flight.model';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-booking',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  currentStepIndex = -1;
  today: string = '';
  origins: string[] = [];
  destinations: string[] = [];
  tripType: string = 'one-way';
  origin: string = '';
  destination: string = '';
  ticketQuantity: string = '';
  fareType: string = '';
  outboundTrips: Flight[][] = [];
  inboundTrips: Flight[][] = [];
  selectedOutboundTripIndex: number | null = null;
  selectedInboundTripIndex: number | null = null;
  extraBaggage: boolean = false;
  extraLegroom: boolean = false;
  priorityBoarding: boolean = false;
  number: string = '';
  name: string = '';
  expiration: string = '';
  cvv: string = '';
  originErrorMessage: string = '';
  destinationErrorMessage: string = '';
  outboundDateErrorMessage: string = '';
  inboundDateErrorMessage: string = '';
  ticketQuantityErrorMessage: string = '';
  fareTypeErrorMessage: string = '';
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  numberErrorMessage: string = '';
  nameErrorMessage: string = '';
  expirationErrorMessage: string = '';
  cvvErrorMessage: string = '';

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.goToTripSearch();
  }

  navigateToTripSearch(event: Event) {
    event.preventDefault();
    this.goToTripSearch();
  }

  goToTripSearch() {
    this.today = new Date().toISOString().slice(0, 10);
    this.extraBaggage = this.extraLegroom = this.priorityBoarding = false;
    this.origins = this.destinations = this.outboundTrips = this.inboundTrips = [];
    this.tripType = 'one-way';
    this.selectedOutboundTripIndex = this.selectedInboundTripIndex = null;
    this.origin = this.destination = this.ticketQuantity = this.fareType = this.number = this.name = this.expiration = this.cvv = '';
    this.originErrorMessage = this.destinationErrorMessage = this.outboundDateErrorMessage = this.inboundDateErrorMessage = this.ticketQuantityErrorMessage = this.fareTypeErrorMessage = this.emailErrorMessage = this.passwordErrorMessage = this.numberErrorMessage = this.nameErrorMessage = this.expirationErrorMessage = this.cvvErrorMessage = '';
    this.api.getCities().subscribe({
      next: (cities: OriginDestination) => {
        this.origins = cities.origins;
        this.destinations = cities.destinations;
        this.currentStepIndex = 0;
      },
      error: () => this.router.navigate(['/500'])
    });
  }

  searchTrips(form: NgForm) {
    this.originErrorMessage = this.destinationErrorMessage = this.outboundDateErrorMessage = this.inboundDateErrorMessage = this.ticketQuantityErrorMessage = this.fareTypeErrorMessage = '';
    const origin = form.value.origin;
    const destination = form.value.destination;
    const outboundDate = form.value.outboundDate;
    const inboundDate = form.value.inboundDate;
    const ticketQuantity = form.value.ticketQuantity;
    const fareType = form.value.fareType;
    if(!origin)
      this.originErrorMessage = 'Origin is required';
    if(!destination)
      this.destinationErrorMessage = 'Destination is required';
    else if(origin === destination)
      this.destinationErrorMessage = 'Destination must be different than origin';
    if(!outboundDate)
      this.outboundDateErrorMessage = 'Outbound date is required';
    if(this.tripType === 'return' && !inboundDate)
      this.inboundDateErrorMessage = 'Inbound date is required';
    else if(this.tripType === 'return' && outboundDate && inboundDate && new Date(inboundDate) <= new Date(outboundDate))
      this.inboundDateErrorMessage = 'Inbound date must be after outbound date';
    if(!ticketQuantity)
      this.ticketQuantityErrorMessage = 'Ticket quantity is required';
    else if(!/^[1-9]\d*$/.test(ticketQuantity))
      this.ticketQuantityErrorMessage = 'Ticket quantity must be a positive integer';
    if(!fareType)
      this.fareTypeErrorMessage = 'Fare type is required';
    if(!this.originErrorMessage && !this.destinationErrorMessage && !this.outboundDateErrorMessage && !this.inboundDateErrorMessage && !this.ticketQuantityErrorMessage && !this.fareTypeErrorMessage){
      this.api.getTrips(form.value).subscribe({
        next: (tripSearchResult: TripSearchResult) => {
          if(tripSearchResult.outboundTrips.length === 0 || (this.tripType === 'return' && tripSearchResult.inboundTrips.length === 0))
            this.currentStepIndex = 1;
          else{
            this.outboundTrips = tripSearchResult.outboundTrips;
            this.inboundTrips = tripSearchResult.inboundTrips;
            this.goToOutboundTripSelection();
          }
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 400){
            for(let message of err.error.messages)
              if(message === 'Unavailable origin')
                this.originErrorMessage = message;
              else if(message === 'Unavailable destination')
                this.destinationErrorMessage = message;
          }
          else
            this.router.navigate(['/500']);
        }
      });
    }
  }

  navigateToOutboundTripSelection(event: Event) {
    event.preventDefault();
    this.goToOutboundTripSelection();
  }

  goToOutboundTripSelection() {
    this.extraBaggage = this.extraLegroom = this.priorityBoarding = false;
    this.selectedOutboundTripIndex = this.selectedInboundTripIndex = null;
    this.number = this.name = this.expiration = this.cvv = '';
    this.emailErrorMessage = this.passwordErrorMessage = this.numberErrorMessage = this.nameErrorMessage = this.expirationErrorMessage = this.cvvErrorMessage = '';
    this.currentStepIndex = 2;
  }

  getOutboundTripPrice(i: number) {
    let tripPrice = 0;
    for(let flight of this.outboundTrips[i]){
      if(this.fareType === 'E')
        tripPrice += flight.economyPrice!;
      else if(this.fareType === 'B')
        tripPrice += flight.businessPrice!;
      else
        tripPrice += flight.firstClassPrice!;
    }
    return tripPrice;
  }

  selectOutboundTrip(i: number) {
    this.selectedOutboundTripIndex = i;
    if(this.tripType === 'return')
      this.goToInboundTripSelection();
    else
      this.goToExtraSelection();
  }

  navigateToInboundTripSelection(event: Event) {
    event.preventDefault();
    this.goToInboundTripSelection();
  }

  goToInboundTripSelection() {
    this.extraBaggage = this.extraLegroom = this.priorityBoarding = false;
    this.selectedInboundTripIndex = null;
    this.number = this.name = this.expiration = this.cvv = '';
    this.emailErrorMessage = this.passwordErrorMessage = this.numberErrorMessage = this.nameErrorMessage = this.expirationErrorMessage = this.cvvErrorMessage = '';
    this.currentStepIndex = 3;
  }

  getInboundTripPrice(i: number) {
    let tripPrice = 0;
    for(let flight of this.inboundTrips[i]){
      if(this.fareType === 'E')
        tripPrice += flight.economyPrice!;
      else if(this.fareType === 'B')
        tripPrice += flight.businessPrice!;
      else
        tripPrice += flight.firstClassPrice!;
    }
    return tripPrice;
  }

  selectInboundTrip(i: number) {
    this.selectedInboundTripIndex = i;
    this.goToExtraSelection();
  }

  navigateToExtraSelection(event: Event) {
    event.preventDefault();
    this.goToExtraSelection();
  }

  goToExtraSelection() {
    this.extraBaggage = this.extraLegroom = this.priorityBoarding = false;
    this.number = this.name = this.expiration = this.cvv = '';
    this.emailErrorMessage = this.passwordErrorMessage = this.numberErrorMessage = this.nameErrorMessage = this.expirationErrorMessage = this.cvvErrorMessage = '';
    this.currentStepIndex = 4;
  }

  getExtraBaggageTotalPrice() {
    let extraBaggageTotalPrice = 0;
    for(let flight of this.outboundTrips[this.selectedOutboundTripIndex!])
      extraBaggageTotalPrice += flight.extraBaggagePrice!;
    if(this.tripType === 'return')
      for(let flight of this.inboundTrips[this.selectedInboundTripIndex!])
        extraBaggageTotalPrice += flight.extraBaggagePrice!;
    return extraBaggageTotalPrice;
  }

  getExtraLegroomTotalPrice() {
    let extraLegroomTotalPrice = 0;
    for(let flight of this.outboundTrips[this.selectedOutboundTripIndex!])
      extraLegroomTotalPrice += flight.extraLegroomPrice!;
    if(this.tripType === 'return')
      for(let flight of this.inboundTrips[this.selectedInboundTripIndex!])
        extraLegroomTotalPrice += flight.extraLegroomPrice!;
    return extraLegroomTotalPrice;
  }

  getPriorityBoardingTotalPrice() {
    let priorityBoardingTotalPrice = 0;
    for(let flight of this.outboundTrips[this.selectedOutboundTripIndex!])
      priorityBoardingTotalPrice += flight.priorityBoardingPrice!;
    if(this.tripType === 'return')
      for(let flight of this.inboundTrips[this.selectedInboundTripIndex!])
        priorityBoardingTotalPrice += flight.priorityBoardingPrice!;
    return priorityBoardingTotalPrice;
  }

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
        next: () => this.goToCheckout(),
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

  goToCheckout() {
    this.number = this.name = this.expiration = this.cvv = '';
    this.emailErrorMessage = this.passwordErrorMessage = this.numberErrorMessage = this.nameErrorMessage = this.expirationErrorMessage = this.cvvErrorMessage = '';
    if(!this.auth.userSignedIn())
      this.currentStepIndex = 5;
    else if(this.auth.getUserType() !== 'passenger')
      this.router.navigate(['/403']);
    else
      this.currentStepIndex = 6;
  }

  getBookingTotalPrice() {
    let bookingTotalPrice = 0;
    bookingTotalPrice += this.getOutboundTripPrice(this.selectedOutboundTripIndex!);
    if(this.tripType === 'return')
      bookingTotalPrice += this.getInboundTripPrice(this.selectedInboundTripIndex!);
    if(this.extraBaggage)
      bookingTotalPrice += this.getExtraBaggageTotalPrice()!;
    if(this.extraLegroom)
      bookingTotalPrice += this.getExtraLegroomTotalPrice()!;
    if(this.priorityBoarding)
      bookingTotalPrice += this.getPriorityBoardingTotalPrice()!;
    return bookingTotalPrice;
  }

  buyTickets() {
    this.numberErrorMessage = this.nameErrorMessage = this.expirationErrorMessage = this.cvvErrorMessage = '';
    if(!this.number)
      this.numberErrorMessage = 'Card number is required';
    else if(!/^\d{16}$/.test(this.number))
      this.numberErrorMessage = 'Invalid card number format';
    if(!this.name)
      this.nameErrorMessage = 'Cardholder name is required';
    else if(!/^[A-Z]+( [A-Z]+)+$/.test(this.name))
      this.nameErrorMessage = 'Invalid cardholder name format';
    if(!this.expiration)
      this.expirationErrorMessage = 'Expiration date is required';
    else if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiration))
      this.expirationErrorMessage = 'Invalid expiration date format';
    if(!this.cvv)
      this.cvvErrorMessage = 'Secret code is required';
    else if(!/^\d{3}$/.test(this.cvv))
      this.cvvErrorMessage = 'Invalid secret code format';
    if(!this.numberErrorMessage && !this.nameErrorMessage && !this.expirationErrorMessage && !this.cvvErrorMessage){
      const bookingDetails = {
        'ticketQuantity': this.ticketQuantity,
        'fareType': this.fareType,
        'outboundTrip': this.outboundTrips[this.selectedOutboundTripIndex!],
        'inboundTrip': this.tripType === 'return'? this.inboundTrips[this.selectedInboundTripIndex!] : [],
        'extraBaggage': this.extraBaggage,
        'extraLegroom': this.extraLegroom,
        'priorityBoarding': this.priorityBoarding,
        'number': this.number,
        'name': this.name,
        'expiration': this.expiration,
        'cvv': this.cvv
      };
      this.api.buyTickets(bookingDetails).subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: (err: HttpErrorResponse) => {
          if(err.status === 400){
            if(err.error.messages[0] === 'Unavailable trip')
              this.currentStepIndex = 7;
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