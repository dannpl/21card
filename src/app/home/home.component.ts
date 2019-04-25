import { HomeService } from './home.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  decks = [];
  stop: boolean;
  isStep0: boolean;
  isStep1: boolean;
  isStep2: boolean;
  isStep3: boolean;
  flag: boolean;
  load: boolean;
  pass: number;

  constructor(private homeService: HomeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initVars();
  }

  initVars() {
    this.stop = true;
    this.isStep0 = true;
    this.isStep1 = false;
    this.isStep2 = false;
    this.isStep3 = false;
    this.flag = false;
    this.load = false;
    this.pass = 0;
  }

  step1() {
    this.isStep0 = false;
    this.isStep1 = true;
    this.snackbarMessage('Hi, Do you want to see a magic?', 'Play').onAction().subscribe(() => {
      this.step2();
    });
  }

  step2() {
    this.isStep1 = false;
    this.isStep2 = true;
    this.stop = false;
    this.load = true;
    this.newDeck();
    this.snackbarMessage('Choose a card and click on the line you are on', 'OK').onAction().subscribe(() => {
      this.isStep2 = false;
      this.isStep3 = true;
    });
  }

  step3(index?, deck?) {
    this.isStep2 = false;
    this.isStep3 = true;
    this.flag = true;
    this.load = true;
    this.snackbarMessage(`Nice, I saw that your letter is on the line ${index + 1}, OK?`, 'OK').onAction().subscribe(() => {
      console.log('d')
      if (this.pass === 0) {
        this.snackbarMessage('Show , agora vamos Embaralhar as cartas 2 vezes , la vai a 1ª', 'OK').onAction().subscribe(() => {
          this.pass = 1;
          this.mixCards(index);
        });
      } else
      if (this.pass === 1) {
        this.snackbarMessage('2º vez agora hein falta so mais uma, jaja falo sua carta', 'OK').onAction().subscribe(() => {
          this.pass = 2;
          this.mixCards(index);
        });
      } else
      if (this.pass === 2) {
        this.snackbarMessage('3ª vez , Hummmmm, pelo que eu vi sua carta é', 'OK').onAction().subscribe(() => {
          this.pass = 3;
          this.mixCards(index);
          this.showCard();
          this.stop = true;
        });
      }
    });
  }

  mixCards(index) {
    let array0 = [];
    let array1 = [];
    let array2 = [];
    if (index === 0) {
      array0 = this.decks[1];
      array1 = this.decks[0];
      array2 = this.decks[2];
      this.pushCards(array0, array1, array2);
    } else
      if (index === 1) {
        array0 = this.decks[0];
        array1 = this.decks[1];
        array2 = this.decks[2];
        this.pushCards(array0, array1, array2);
      } else
        if (index === 2) {
          array0 = this.decks[0];
          array1 = this.decks[2];
          array2 = this.decks[1];
          this.pushCards(array0, array1, array2);
        }
    this.load = false;
  }

  pushCards(array0, array1, array2) {
    this.decks = [[], [], []];
    const arrSec = [];
    const arr = [];
    array0.forEach(element => {
      arrSec.push(element);
    });
    array1.forEach(element => {
      arrSec.push(element);
    });
    array2.forEach(element => {
      arrSec.push(element);
    });
    for (let i = 0; i < arrSec.length; i++) {
      const pos1 = [1, 4, 7, 10, 13, 16, 19];
      const pos2 = [2, 5, 8, 11, 14, 17, 20];
      if (i % 3 === 0) {
        this.decks[0].push(arrSec[i]);
      } else {
        pos1.forEach(element => {
          if (element === i) {
            this.decks[1].push(arrSec[i]);
          }
        });
        pos2.forEach(element => {
          if (element === i) {
            this.decks[2].push(arrSec[i]);
          }
        });
      }
    }
  }

  showCard() {
    console.log(this.decks[1][3]);
  }

  snackbarMessage(message: string, action: string) {
    return this.snackBar.open(message, action);
  }

  addClassDeck(nameClass: string) {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`deck${i}`).classList.add(`${nameClass}`);
    }
  }

  newDeck() {
    this.homeService.getDeck().then(res => {
      this.newDeckById(res.deck_id);
    }, err => {
      this.load = false;
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
      this.load = false;
    }, err => {
      this.load = false;
    });
  }
}
