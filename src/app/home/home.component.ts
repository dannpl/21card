import { HomeService } from './home.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogCardComponent } from './../dialog-card/dialog-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  decks = [];
  stop: boolean;
  isStep1: boolean;
  isStep2: boolean;
  isStep3: boolean;
  flag: boolean;
  load: boolean;
  pass: number;
  type: string;

  constructor(private homeService: HomeService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.initVars();
    this.newDeck();
  }

  // Start variables
  initVars() {
    this.stop = true;
    this.isStep1 = true;
    this.isStep2 = false;
    this.isStep3 = false;
    this.flag = false;
    this.load = false;
    this.pass = 0;
    this.type = 'reset';
  }

  // Get in api the ID of the deck
  newDeck() {
    this.homeService.getDeck().then(res => {
      this.newDeckById(res.deck_id);
    }, err => {
      this.load = false;
    });
  }

  // Get in api with id and an object is returned with more information
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

  // Trick step 1
  step1() {
    this.isStep1 = false;
    this.isStep2 = true;
    this.stop = false;
    this.snackbarMessage('Choose a card and click on the line it is on', 'OK').onAction().subscribe(() => {
      this.isStep2 = false;
      this.isStep3 = true;
    });
  }

  // Trick step 2
  step2(index?, deck?) {
    this.isStep2 = false;
    this.isStep3 = true;
    if (!this.flag) { // confirms that a column has already been clicked on the template
      this.flag = true;
      document.getElementById(`${deck}`).classList.add('active');
      this.addClassDeck('block');
      this.snackbarMessage(`Nice, I saw that your letter is on the line ${index + 1}, OK?`, 'OK').onAction().subscribe(() => {
        this.load = true;
        if (this.pass === 0) { // confirm the number of rounds
          this.snackbarMessage(`Show, now let's shuffle the cards 2 times.`, 'Next').onAction().subscribe(() => {
            this.pass = 1;
            this.flag = false;
            this.mixCards(index); // calls the shuffle function
          });
        } else
        if (this.pass === 1) { // confirm the number of rounds
          this.snackbarMessage(`Second time now, let's go to the last one!`, 'Next').onAction().subscribe(() => {
            this.pass = 2;
            this.flag = false;
            this.mixCards(index); // calls the shuffle function
          });
        } else
        if (this.pass === 2) { // confirm the number of rounds
          this.snackbarMessage('Third time, and your letter is...', 'Show My letter').onAction().subscribe(() => {
            this.pass = 3;
            this.flag = false;
            this.mixCards(index); // calls the shuffle function
            this.showCard();
            this.stop = true;
          });
        }
      });
    }
  }

  // Concatenate the arrays and shuffle the cards
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

  // Verifies how the array will remain
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

  // Show chosen card
  showCard() {
    const dialogRef = this.dialog.open(DialogCardComponent, {
      data: {card: this.decks[1][3]}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === 'reset') { // reset game
        this.isStep1 = true;
        this.isStep3 = false;
        this.pass = 0;
        this.newDeck();
      } else { // run new rodade with current deck
        this.stop = false;
        this.pass = 0;
      }
    });
  }

  // Show snackbar
  snackbarMessage(message: string, action: string) {
    return this.snackBar.open(message, action);
  }

  // Add class in array of the decks
  addClassDeck(nameClass: string) {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`deck${i}`).classList.add(`${nameClass}`);
    }
  }
}
