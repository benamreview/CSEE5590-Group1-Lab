import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  constructor() {
    this.snake = {
      size: 2,
      direction: "right",
      body: []
    }
  }

  BOARD_SIZE = 20;
  board: boolean[];
  snake: {
    size: number,
    direction: string,
    body: Array<Array<number>>;
  };

  ngOnInit() {
    this.initBoard();
    this.initSnake();
  }

  // Event listeners for user input - used for changing direction of snake.
  @HostListener('document:keydown', ['$event'])
  keyEvent(e: KeyboardEvent) {
    const directions = {
      'ArrowUp': 'up', 'w': 'up',
      'ArrowRight': 'right', 'd': 'right',
      'ArrowDown': 'down', 's': 'down',
      'ArrowLeft': 'left', 'a': 'left'
    };

    if (directions[e.key]) {
      this.snake.direction = directions[e.key];
    }
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

  initSnake() {
    this.snake.body.push([9, 4], [9, 3]);

    this.updateBoard();
  }

  updateBoard() {
    const board = this.board;

    this.snake.body.forEach(pos => {
      const [x, y] = pos;
      board[x][y] = true;
    });

    this.board = [...board];
  }
}
