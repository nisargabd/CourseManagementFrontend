import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FilterOptions {
  boards: string[];
  mediums: string[];
  grades: string[];
  subjects: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterOptionsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getFilterOptions(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(`${this.baseUrl}/filters/options`);
  }
}
