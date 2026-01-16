import { Routes } from '@angular/router';
import { BookingComponent } from './components/booking/booking.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { RouteListComponent } from './components/route-list/route-list.component';
import { AircraftListComponent } from './components/aircraft-list/aircraft-list.component';
import { AircraftDetailsComponent } from './components/aircraft-details/aircraft-details.component';
import { FlightListComponent } from './components/flight-list/flight-list.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
//import { UserListComponent } from './components/user-list/user-list.component';
//import { AirlineListComponent } from './components/airline-list/airline-list.component';
//import { AirlineDetailsComponent } from './components/airline-details/airline-details.component';
//import { PassengerListComponent } from './components/passenger-list/passenger-list.component';
//import { PassengerDetailsComponent } from './components/passenger-details/passenger-details.component';
//import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


export const routes: Routes = [
    { path: '', redirectTo: '/booking', pathMatch: 'full' },
    { path: 'booking', component: BookingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'account', component: AccountDetailsComponent },
    { path: 'routes', component: RouteListComponent },
    { path: 'aircrafts', component: AircraftListComponent },
    { path: 'aircrafts/:id', component: AircraftDetailsComponent },
    { path: 'flights', component: FlightListComponent },
    { path: 'flights/:id', component: FlightDetailsComponent },
    { path: 'tickets', component: TicketListComponent },
    { path: 'tickets/:id', component: TicketDetailsComponent },
    //{ path: 'users', component: UserListComponent },
    //{ path: 'users/airlines', component: AirlineListComponent },
    //{ path: 'users/airlines/:id', component: AirlineDetailsComponent },
    //{ path: 'users/passengers', component: PassengerListComponent },
    //{ path: 'users/passengers/:id', component: PassengerDetailsComponent },
    //{ path: 'complete-registration', component: CompleteRegistrationComponent },
    { path: '401', component: UnauthorizedComponent },
    { path: '403', component: ForbiddenComponent },
    { path: '500', component: InternalServerErrorComponent },
    { path: '**', component: NotFoundComponent }
];