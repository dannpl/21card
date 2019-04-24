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
  flag = false
  load = false
  constructor(private homeService: HomeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  step0() {
    this.isStep0 = false;
    this.isStep1 = true;
    this.snackbarMessage('Hi, Do you want to see a magic?', 'Play').onAction().subscribe(() => {
      this.step1();
    });
  }

  step1() {
    this.isStep1 = false;
    this.isStep2 = true;
    this.stop = false;
    this.load = true
    this.newDeck();
    this.snackbarMessage('Choose a card and click on the line you are on', 'OK').onAction().subscribe(() => {
      this.isStep2 = false;
      this.isStep3 = true;
    });
  }

  step2(index?, deck?) {
    this.isStep2 = false;
    this.isStep3 = true;
    if (!this.flag) {
      this.flag = true
      this.addClassDeck('block')
      document.getElementById(`${deck}`).classList.add('active')
      this.snackbarMessage(`Nice, I saw that your letter is on the line ${index + 1}, OK?`, 'OK').onAction().subscribe(() => {
        this.load = true
        this.mixCards(index)
      });
    }
  }

  mixCards(index) {
    console.log(this.decks)
    let array0 = []
    let array1 = []
    let array2 = []
    if (index == 0) { 
      array0 = this.decks[1]
      array1 = this.decks[0]
      array2 = this.decks[2]
      this.pushCards(array0,array1,array2)
    } else
    if (index == 1) {
      array0 = this.decks[0]
      array1 = this.decks[1]
      array2 = this.decks[2]
      this.pushCards(array0,array1,array2)
    } else 
    if (index == 2) {
      array0 = this.decks[0]
      array1 = this.decks[2]
      array2 = this.decks[1]
      this.pushCards(array0,array1,array2)
    }
    this.snackbarMessage('Embaralhando as cartas', 'OK')
  }

  pushCards(array0,array1,array2) {
    let arrSec = []
    array0.forEach(element => {
      arrSec.push(element)
    })
    array1.forEach(element => {
      arrSec.push(element)
    })
    array2.forEach(element => {
      arrSec.push(element)
    })
    console.log(arrSec)
  }

  snackbarMessage(message: string, action: string) {
    return this.snackBar.open(message, action);
  }

  addClassDeck(nameClass: string) {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`deck${i}`).classList.add(`${nameClass}`)
    }
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
      this.load = false
    });
  }
}
