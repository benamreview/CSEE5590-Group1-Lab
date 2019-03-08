import {Component, HostListener, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  constructor() {
    this.score = 0;

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
    this.started = false;
  }

  // Game Variables
  private BOARD_SIZE = 20;
  private INTERVAL = 150;

  // Game information
  private board: number[][];    // 0 = Blank, 1 = Snake, 2 = Fruit
  private score: number;
  private snake: {
    size: number,
    direction: number[],
    body: number[][]
  };
  private fruit: {
    x: number,
    y: number
  };
  private gameOver: boolean;
  public started: boolean;

  ngOnInit() {
    this.initBoard();
    this.updateBoard();
  }

  @Output() getScore = new EventEmitter<number>();

  // Event listeners for user input - used for changing direction of snake.
  @HostListener('document:keydown', ['$event'])
  keyEvent(e: KeyboardEvent) {
    const direction = {
      'ArrowUp': [-1, 0], 'w': [-1, 0],
      'ArrowRight': [0, 1], 'd': [0, 1],
      'ArrowDown': [1, 0], 's': [1, 0],
      'ArrowLeft': [0, -1], 'a': [0, -1]
    }[e.key];

    // FIXME: Trying to head in the opposite direction shouldn't result in a collision - keystroke should just be ignored.

    if (direction) {
      this.snake.direction = direction;
    }

    // Game starts when user presses key
    if (!this.started) {
      this.startGame();
      this.started = true;
    }
  }


  initBoard() {
    // Create nested array, fill with false.
    this.board = Array.from({length: this.BOARD_SIZE}, (v, i) =>
      Array.from({length: this.BOARD_SIZE}, (v, k) => 0));
  }


  startGame() {
    if (this.gameOver)
      return;

    this.updateBoard();

    setTimeout(() => {
      this.startGame();
    }, this.INTERVAL);
  }


  updateBoard() {
    this.updateSnake();
    this.drawBoard();
  }


  updateSnake() {
    // TODO: This function should probably be split up.
    const body = [...this.snake.body];
    const [dx, dy] = this.snake.direction;

    // Add updated head to body
    const newHead = [body[0][0] + dx, body[0][1] + dy];
    body.unshift(newHead);

    // End game if collision detected
    if (!this.checkCollision(newHead))
      return this.endGame();

    // Get value of head on board
    const head = this.board[body[0][0]][body[0][1]];

    if (head !== 2) {
      const tail = body.pop();
      this.board[tail[0]][tail[1]] = 0;
    } else {
      // Remove old fruit, add new one
      this.addFruit();
    }

    this.snake.body = [...body];
  }


  addFruit() {
    // Remove old fruit
    this.board[this.fruit.y][this.fruit.x] = 0;

    // Increment score, emit to parent
    this.score++;
    this.getScore.emit(this.score);

    // Generate new fruit
    const fruit = {
      x: Math.floor(Math.random() * this.BOARD_SIZE),
      y: Math.floor(Math.random() * this.BOARD_SIZE)
    };

    // Make sure fruit doesn't collide with snake
    while (this.board[fruit.y][fruit.x] !== 0) {
      fruit.x = Math.floor(Math.random() * this.BOARD_SIZE);
      fruit.y = Math.floor(Math.random() * this.BOARD_SIZE);
    }

    this.fruit = {...fruit};
  }


  checkCollision(head) {
    const [x, y] = head;
    const size = this.BOARD_SIZE - 1;

    // Make sure position is inbounds.
    if (x < 0 || x > size || y < 0 || y > size)
      return false;

    // Make sure position not already occupied.
    return this.board[x][y] === 0 || this.board[x][y] === 2;
  }


  drawBoard() {
    const board = this.board;

    // Draw snake
    this.snake.body.forEach(pos => board[pos[0]][pos[1]] = 1);

    // Draw fruit
    board[this.fruit.y][this.fruit.x] = 2;

    this.board = [...board];
  }


  endGame() {
    // TODO: Add play again functionality.
    this.gameOver = true;
  }
}
