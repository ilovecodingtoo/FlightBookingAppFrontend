import { Component, OnInit, viewChild, ElementRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { User } from './models/user.model';
import { CommonModule } from '@angular/common';
import { SuccessService } from './services/success.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  viewDataInitialized: boolean = false;
  detailsElement = viewChild<ElementRef<HTMLDetailsElement>>('detailsElement');

  constructor(private router: Router, private auth: AuthService, private api: ApiService, private success: SuccessService) {}

  ngOnInit() {
    if(!this.auth.userSignedIn()) this.viewDataInitialized = true;
    else{
      this.api.getUserDetails(this.auth.getUserId()).subscribe({
        next: (currentUser: User) => {
          this.auth.setCurrentUser(currentUser);
          this.viewDataInitialized = true;
        },
        error: () => {
          this.auth.clearSession();
          this.viewDataInitialized = true;
        }
      });
    }
  }

  userSignedIn() {
    return this.auth.userSignedIn();
  }

  getUserType() {
    return this.auth.getUserType();
  }

  getUserEmail() {
    return this.auth.getCurrentUser()?.email;
  }

  navigateToNewRoute(event: Event, newRoute: string) {
    event.preventDefault();
    this.detailsElement()!.nativeElement.open = false;
    this.router.navigate([newRoute]);
  }

  logoutUser(event: Event) {
    event.preventDefault();
    this.auth.clearSession();
    this.detailsElement()!.nativeElement.open = false;
    this.success.setContent('Logged out successfully');
    this.router.navigate(['/booking']);
  }

  getSuccessContent() {
    return this.success.getContent();
  }
}