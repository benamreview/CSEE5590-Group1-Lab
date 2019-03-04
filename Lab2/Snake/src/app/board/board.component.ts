import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  constructor() { }

  BOARD_SIZE = 20;
  board: boolean[];

  ngOnInit() {
    this.initBoard();
  }

  initBoard() {
    const board = [];

    for (let i = 0; i < this.BOARD_SIZE; i++) {
      const row = [];

      for (let j = 0; j < this.BOARD_SIZE; j++) {
        row.push(false);
      }

      board.push(row);
    }

    this.board = [...board];
  }

}
