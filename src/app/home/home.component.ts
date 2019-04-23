import { HomeService } from './home.service';
import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  decks = [];
  stop = true;
  isStep0 = true;
  isStep1 = false;
  isStep2 = false;
  isStep3 = false;
  constructor(private homeService: HomeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  step0() {
    this.newDeck();
    this.isStep0 = false;
    this.isStep1 = true;
    const snackBarRef = this.snackBar.open('Hi, Do you want to see a magic?', 'Play');
    snackBarRef.onAction().subscribe(() => {
      this.step1();
    });
  }

  step1() {
    this.isStep1 = false;
    this.isStep2 = true;
    this.stop = false;
    const snackBarRef = this.snackBar.open('Choose a card and click on the line you are on', 'OK');
    snackBarRef.onAction().subscribe(() => {
      this.isStep2 = false;
      this.isStep3 = true;
    });
  }

  step2(index?) {
    this.isStep2 = false;
    this.isStep3 = true;
    const snackBarRef = this.snackBar.open(`Nice, I saw that your letter is on the line ${index + 1} `, 'OK');
    snackBarRef.onAction().subscribe(() => {
    });
  }

  newDeck() {
    this.homeService.getDeck().then(res => {
      this.newDeckById(res.deck_id);
    });
  }

  newDeckById(id: string) {
    let arr = [];
    let j = 0;
    this.homeService.getDeckById(id).then(res => {
      for (let i = 0; i < res.cards.length; i++) {
        if (arr.length < 7) {
          arr.push(res.cards[i]);
        }
        if (arr.length === 7 && j < 3) {
          this.decks[j] = arr;
          arr = [];
          j++;
        }
      }
    });
  }
}
