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
  board: boolean[][];
  snake: {
    size: number,
    direction: string,
    body: number[][]
  };
  fruit: {
    coords: number[][];
  };

  ngOnInit() {
    this.initBoard();
    this.initSnake();
    this.initFruit();
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
    // Create nested array, fill with false.
    this.board = Array.from({length: this.BOARD_SIZE}, (v, i) =>
      Array.from({length: this.BOARD_SIZE}, (v, k) => false));
  }

  initSnake() {
    this.snake.body.push([9, 4], [9, 3]);
    this.updateBoard();
  }

  // Starting fruit position
  initFruit() {
    this.fruit.coords.push([9, 17])
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
