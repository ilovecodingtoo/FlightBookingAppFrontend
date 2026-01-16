import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';


interface TokenPayload {
  id: string;
  userType: string;
  exp: number;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(currentUser: User) {
    this.currentUser = currentUser;
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getUserId() {
    try{
      return jwtDecode<TokenPayload>(this.getToken()).id;
    }
    catch{
      return null;
    }
  }

  getUserType() {
    try{
      return jwtDecode<TokenPayload>(this.getToken()).userType;
    }
    catch{
      return 'anonymous';
    }
  }

  userSignedIn() {
    try{
      return jwtDecode<TokenPayload>(this.getToken()).exp * 1000 > Date.now();
    }
    catch{
      return false;
    }
  }

  clearSession() {
    localStorage.removeItem('token');
    this.currentUser = null;
  }
}