import { baseUrl } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {

  constructor(private http: HttpClient) { }

  register(data: any):Observable<any>{
    return this.http.post(`${baseUrl}labels/`,data);
  }

  getAll(page: number):Observable<any>{
    return this.http.get(`${baseUrl}labels?page=${page}`);
  }

  delete(id: any):Observable<any>{
    return this.http.delete(`${baseUrl}labels/${id}`);
  }

}
