import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  api: string;
  constructor(private http: HttpClient) { 
    this.api = 'https://deckofcardsapi.com/api/deck/';
  }

  getDeck(): Promise<any> {
    return this.http.get(`${this.api}new/shuffle/?deck_count=1`).toPromise();
  }

  getDeckById(id : string): Promise<any> {
    return this.http.get(`${this.api}${id}/draw/?count=52`).toPromise();
  }
}
