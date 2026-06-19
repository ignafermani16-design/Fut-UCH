import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FootballService {

  private apiUrl = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/';
  private apiToken = '2890522785e7425d87654e81b1386236'; 

  constructor(private http: HttpClient) { }

  // Método asíncrono para traer las ligas
  getCompetitions(): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth-Token': this.apiToken
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }

  // ESTE MÉTODO FALTABA: Trae los equipos de una liga
  getTeams(competitionCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Auth-Token': this.apiToken
    });
    const url = `https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${competitionCode}/teams`;
    return this.http.get<any>(url, { headers });
  }
}