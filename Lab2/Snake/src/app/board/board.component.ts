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
      direction: [0, 1],
      body: [[9, 4], [9, 3]]
    };

    this.fruit = {
      x: 16,
      y: 9
    };

    this.gameOver = false;
  }

  BOARD_SIZE = 20;
  board: number[][];    // 0 = Blank, 1 = Snake, 2 = Fruit
  snake: {
    size: number,
    direction: number[],
    body: number[][]
  };
  fruit: {
    x: number,
    y: number
  };
  gameOver: boolean;

  ngOnInit() {
    this.initBoard();
    this.updateBoard();
  }

  // Event listeners for user input - used for changing direction of snake.
  @HostListener('document:keydown', ['$event'])
  keyEvent(e: KeyboardEvent) {
    const directions = {
      'ArrowUp': [-1, 0], 'w': [-1, 0],
      'ArrowRight': [0, 1], 'd': [0, 1],
      'ArrowDown': [1, 0], 's': [1, 0],
      'ArrowLeft': [0, -1], 'a': [0, -1]
    };

    if (directions[e.key]) {
      this.snake.direction = directions[e.key];
    }

    this.updateBoard();
  }

  initBoard() {
    // Create nested array, fill with false.
    this.board = Array.from({length: this.BOARD_SIZE}, (v, i) =>
      Array.from({length: this.BOARD_SIZE}, (v, k) => 0));
  }

  updateBoard() {
    this.updateSnake();
    this.drawBoard();
  }

  updateSnake() {
    const body = this.snake.body;
    const [dx, dy] = this.snake.direction;

    // Add updated head to body
    body.unshift([body[0][0] + dx, body[0][1] + dy]);

    // Get head position on board
    const head = this.board[body[0][0]][body[0][1]];

    if (head !== 2) {
      const tail = body.pop();
      this.board[tail[0]][tail[1]] = 0;
    } else {
      // Remove fruit from board
      this.addFruit();
    }

    this.snake.body = [...body];
  }

  addFruit() {
    // Remove old fruit
    this.board[this.fruit.y][this.fruit.x] = 0;

    // Generate new fruit
    const fruit = {
      x: Math.floor(Math.random() * this.BOARD_SIZE),
      y: Math.floor(Math.random() * this.BOARD_SIZE)
    };

    this.fruit = {...fruit};
  }

  // checkGameOver() {
  //   // Coordinates of snake's head
  //   const [x, y] = this.snake.body[0];
  //
  //   // Check if head of snake is inbounds
  //   if (x < 0 || x > this.BOARD_SIZE - 1)
  //     this.gameOver = true;
  //   else if (y < 0 || y > this.BOARD_SIZE - 1)
  //     this.gameOver = true;
  //   else
  //     return this.drawBoard();
  //
  //   // Game Over
  //   // TODO: Add game over, play again functionality.
  // }

  drawBoard() {
    const board = this.board;

    // Draw snake
    this.snake.body.forEach(pos => board[pos[0]][pos[1]] = 1);

    // Draw fruit
    board[this.fruit.y][this.fruit.x] = 2;

    this.board = [...board];
  }
}
