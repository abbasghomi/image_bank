import { baseUrl } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  update(id: any, data: any):Observable<any>{
    return this.http.put(`${baseUrl}review/${id}`,data);
  }

  getAll(page: number):Observable<any>{
    return this.http.get(`${baseUrl}review?page=${page}`);
  }

  delete(id: any):Observable<any>{
    return this.http.delete(`${baseUrl}review/${id}`);
  }

  getById(id: any):Observable<any>{
    return this.http.get(`${baseUrl}review/${id}`);
  }

}
