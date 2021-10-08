import { baseUrl } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabelingService {

  constructor(private http: HttpClient) { }

  register(data: any):Observable<any>{
    return this.http.post(`${baseUrl}labeling/`,data);
  }

  getAll(page: number):Observable<any>{
    return this.http.get(`${baseUrl}labeling?page=${page}`);
  }

  delete(id: any):Observable<any>{
    return this.http.delete(`${baseUrl}labeling/${id}`);
  }

}
