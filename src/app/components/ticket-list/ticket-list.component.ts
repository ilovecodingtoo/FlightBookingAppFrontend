import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  viewDataInitialized: boolean = false;
  tickets: Ticket[] = [];

  constructor(private auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    if(!this.auth.userSignedIn())
      this.router.navigate(['/401']);
    else if(this.auth.getUserType() === 'airline')
      this.router.navigate(['/403']);
    else{
      this.api.getTickets().subscribe({
        next: (tickets: Ticket[]) => {
          this.tickets = tickets;
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
}