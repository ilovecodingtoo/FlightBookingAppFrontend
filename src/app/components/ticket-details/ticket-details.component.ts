import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit {
  viewDataInitialized: boolean = false;
  ticketNotfound: boolean = false;
  ticket: Ticket | null = null;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    else if(this.auth.getUserType() === 'airline')
      this.router.navigate(['/403']);
    else{
      this.api.getTicketDetails(this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
        next: (ticket: Ticket) => {
          this.ticket = ticket;
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
            this.ticketNotfound = true;
          else
            this.router.navigate(['/500']);
        }
      });
    }
  }

  getUserType() {
    return this.auth.getUserType();
  }

  deleteTicket() {
    this.api.deleteTicket(this.ticket?.id).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (err: HttpErrorResponse) => {
        if(err.status === 401){
          this.auth.clearSession();
          this.router.navigate(['/401']);
        }
        else if(err.status === 403)
          this.router.navigate(['/403']);
        else if(err.status === 404)
          this.ticketNotfound = true;
        else
          this.router.navigate(['/500']);
      }
    });
  }
}