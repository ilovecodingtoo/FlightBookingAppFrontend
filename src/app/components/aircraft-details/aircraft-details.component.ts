import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Aircraft } from '../../models/aircraft.model';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-aircraft-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './aircraft-details.component.html',
  styleUrl: './aircraft-details.component.css'
})
export class AircraftDetailsComponent implements OnInit {
  viewDataInitialized: boolean = false;
  aircraftNotfound: boolean = false;
  aircraft: Aircraft | null = null;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    else if(this.auth.getUserType() === 'passenger')
      this.router.navigate(['/403']);
    else{
      this.api.getAircraftDetails(this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
        next: (aircraft: Aircraft) => {
          this.aircraft = aircraft;
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
            this.aircraftNotfound = true;
          else
            this.router.navigate(['/500']);
        }
      });
    }
  }

  getUserType() {
    return this.auth.getUserType();
  }

  deleteAircraft() {
    this.api.deleteAircraft(this.aircraft?.id).subscribe({
      next: () => this.router.navigate(['/aircrafts']),
      error: (err: HttpErrorResponse) => {
        if(err.status === 401){
          this.auth.clearSession();
          this.router.navigate(['/401']);
        }
        else if(err.status === 403)
          this.router.navigate(['/403']);
        else if(err.status === 404)
          this.aircraftNotfound = true;
        else
          this.router.navigate(['/500']);
      }
    });
  }
}