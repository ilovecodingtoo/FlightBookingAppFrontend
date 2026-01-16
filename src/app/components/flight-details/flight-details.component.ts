import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Flight } from '../../models/flight.model';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-flight-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.css'
})
export class FlightDetailsComponent implements OnInit {
  viewDataInitialized: boolean = false;
  flightNotfound: boolean = false;
  flight: Flight | null = null;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    else if(this.auth.getUserType() === 'passenger')
      this.router.navigate(['/403']);
    else{
      this.api.getFlightDetails(this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
        next: (flight: Flight) => {
          this.flight = flight;
          this.viewDataInitialized = true;
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 401){
            this.auth.clearSession();
            this.router.navigate(['/401']);
          }
          else if(err.status === 403)
            this.router.navigate(['/403']);
          else if(err.status === 404)
            this.flightNotfound = true;
          else
            this.router.navigate(['/500']);
        }
      });
    }
  }

  getUserType() {
    return this.auth.getUserType();
  }

  deleteFlight() {
    this.api.deleteFlight(this.flight?.id).subscribe({
      next: () => this.router.navigate(['/flights']),
      error: (err: HttpErrorResponse) => {
        if(err.status === 401){
          this.auth.clearSession();
          this.router.navigate(['/401']);
        }
        else if(err.status === 403)
          this.router.navigate(['/403']);
        else if(err.status === 404)
          this.flightNotfound = true;
        else
          this.router.navigate(['/500']);
      }
    });
  }
}