import { baseUrl } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {
  isLoggedIn = this.getToken()!=null;

  isLoggedInChange: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.isLoggedIn = this.getToken()!=null;
      this.isLoggedInChange.subscribe((value) => {
          this.isLoggedIn = value
      });
  }

  setIsLoggedIn(isLoggedInValue: boolean) {
    this.isLoggedIn = isLoggedInValue
    this.isLoggedInChange.next(this.isLoggedIn);
  }

  public getToken(): string {
    return localStorage.getItem('token')!;
  }

  login(data: any):Observable<any>{
    return this.http.post(`${baseUrl}login/`,data);
  }

  register(data: any):Observable<any>{
    return this.http.post(`${baseUrl}users/`,data);
  }

}
