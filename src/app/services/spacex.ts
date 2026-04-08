import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Launch } from '../models/launch.model';

@Injectable({
  providedIn: 'root',
})
export class SpacexService {
  private readonly apiUrl = 'https://api.spacexdata.com/v3/launches';

  constructor(private readonly http: HttpClient) {}

  fetchLaunches(): Observable<Launch[]> {
    return this.http.get<Launch[]>(this.apiUrl);
  }

  fetchLaunchesByYear(year: string): Observable<Launch[]> {
    return this.http.get<Launch[]>(`${this.apiUrl}?launch_year=${year}`);
  }

  fetchMissionDetails(flightNumber: number): Observable<Launch> {
    return this.http.get<Launch>(`${this.apiUrl}/${flightNumber}`);
  }
}
