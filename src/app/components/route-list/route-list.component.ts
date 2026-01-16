import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Route } from '../../models/route.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-route-list',
  imports: [CommonModule],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css'
})
export class RouteListComponent implements OnInit {
  viewDataInitialized: boolean = false;
  routes: Route[] = [];

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
      if(!this.auth.userSignedIn())
        this.router.navigate(['/401']);
      else if(this.auth.getUserType() === 'passenger')
        this.router.navigate(['/403']);
      //else if(this.auth.getUserType() === 'airline' && !this.auth.getCurrentUser()?.registrationCompleted)
      //  this.router.navigate(['/complete-registration']);
      else{
        this.api.getRoutes().subscribe({
          next: (routes: Route[]) => {
            this.routes = routes;
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
}