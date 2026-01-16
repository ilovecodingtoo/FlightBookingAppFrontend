import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Ticket } from '../models/ticket.model';
import { User } from '../models/user.model';
import { Aircraft } from '../models/aircraft.model';
import { Flight } from '../models/flight.model';
import { tap } from 'rxjs/operators';
import { TripSearchResult } from '../models/trip-search-result.model';
import { Route } from '../models/route.model';
import { OriginDestination } from '../models/origin-destination.model';
import { SuccessService } from './success.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseApiUrl = environment.BASE_API_URL;

  constructor(private http: HttpClient, private auth: AuthService, private success: SuccessService) {}

  getTrips(params: any) {
    return this.http.get<TripSearchResult>(`${this.baseApiUrl}/trips`, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache'
      }),
      params: params
    });
  }

  registerAirline(body: any) {
    return this.http.post(`${this.baseApiUrl}/users/airlines`, body, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  registerPassenger(body: any) {
    return this.http.post(`${this.baseApiUrl}/users/passengers`, body, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  login(body: any) {
    return this.http.post(`${this.baseApiUrl}/login`, body, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => {
          this.auth.setToken(response.token);
          this.auth.setCurrentUser(response.currentUser);
          this.success.setContent(response.messages[0]);
        }
      )
    );
  }

  getCities() {
    return this.http.get<OriginDestination>(`${this.baseApiUrl}/cities`, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache'
      })
    });
  }

  getUserDetails(id: any) {
    return this.http.get<User>(`${this.baseApiUrl}/users/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  updateUserDetails(id: any, body: any) {
    return this.http.put(`${this.baseApiUrl}/users/${id}`, body, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => {
          this.auth.setCurrentUser(response.currentUser);
          this.success.setContent(response.messages[0]);
        }
      )
    );
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.baseApiUrl}/users/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  getRoutes() {
    return this.http.get<Route[]>(`${this.baseApiUrl}/routes`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  getAircrafts() {
    return this.http.get<Aircraft[]>(`${this.baseApiUrl}/aircrafts`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  addAircraft(body: any) {
    return this.http.post(`${this.baseApiUrl}/aircrafts`, body, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  getAircraftDetails(id: any) {
    return this.http.get<Aircraft>(`${this.baseApiUrl}/aircrafts/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  deleteAircraft(id: any) {
    return this.http.delete(`${this.baseApiUrl}/aircrafts/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  getFlights() {
    return this.http.get<Flight[]>(`${this.baseApiUrl}/flights`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  addFlight(body: any) {
    return this.http.post(`${this.baseApiUrl}/flights`, body, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  getFlightDetails(id: any) {
    return this.http.get<Flight>(`${this.baseApiUrl}/flights/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  deleteFlight(id: any) {
    return this.http.delete(`${this.baseApiUrl}/flights/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  getTickets() {
    return this.http.get<Ticket[]>(`${this.baseApiUrl}/tickets`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  buyTickets(body: any) {
    return this.http.post(`${this.baseApiUrl}/tickets`, body, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache',
        'Content-Type':  'application/json'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }

  getTicketDetails(id: any) {
    return this.http.get<Ticket>(`${this.baseApiUrl}/tickets/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    });
  }

  deleteTicket(id: any) {
    return this.http.delete(`${this.baseApiUrl}/tickets/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Cache-Control': 'no-cache'
      })
    })
    .pipe(
      tap(
        (response: any) => this.success.setContent(response.messages[0])
      )
    );
  }
}