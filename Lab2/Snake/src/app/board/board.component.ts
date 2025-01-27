import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {GameMode} from '../game-mode.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  readonly Item = ItemType; // Local reference to expose to template.
  readonly Mode = GameMode;

  // Game Variables
  private BOARD_SIZE = 20;
  private INTERVAL = 150;
  private OBSTACLES = 25;

  // Game information
  public board: BoardItem[][];
  private score: number;
  private snake: {
    direction: Direction,
    body: Segment[]
  };
  private fruit: Point;
  public gameOver = false;
  public started = false;
  private lastUpdate = 0;

  @Output() getScore = new EventEmitter<number>();
  mode: GameMode = GameMode.NoWalls;

  ngOnInit() {
    // Start the game loop right away.
    requestAnimationFrame(time => this.startGame(time));
  }

  initGame() {
    this.score = 0;
    this.initBoard();
    this.snake = {
      direction: Directions.right,
      body: [
        {point: {y: 9, x: 4}, orientation: 'right'},
        {point: {y: 9, x: 3}, orientation: 'right'}
      ]
    };

    this.fruit = {
      x: 16,
      y: 9
    };
    this.gameOver = false;
    this.started = true;
  }

  private changeMode(forward: boolean) {
    const modes = [GameMode.Classic, GameMode.NoWalls, GameMode.Obstacles];
    const current = modes.indexOf(this.mode);
    const next = forward ? Math.min(current + 1, modes.length - 1) : Math.max(current - 1, 0);
    this.mode = modes[next];
  }

  // Event listeners for user input - used for changing direction of snake.
  @HostListener('document:keydown', ['$event'])
  keyEvent(e: KeyboardEvent) {
    // Game starts when user presses key
    if (!this.started) {
      if (e.key === ' ' || e.key === 'Enter') {
        this.initGame();
      } else if (e.key === 'Tab') {
        this.changeMode(!e.shiftKey);
      } else if (e.key === 'ArrowRight') {
        this.changeMode(true);
      } else if (e.key === 'ArrowLeft') {
        this.changeMode(false);
      }
      e.preventDefault();
      return;
    }

    const direction = {
      ArrowUp: Directions.up, w: Directions.up,
      ArrowRight: Directions.right, d: Directions.right,
      ArrowDown: Directions.down, s: Directions.down,
      ArrowLeft: Directions.left, a: Directions.left
    }[e.key];

    if (validDirection(this.snake.direction, direction)) {
      this.snake.direction = direction;
      this.updateBoard(performance.now());
    }
  }

  initBoard() {
    // Create nested array, fill with false.
    this.board = Array.from({length: this.BOARD_SIZE}, () =>
      Array.from({length: this.BOARD_SIZE}, () => ({type: ItemType.Blank})));

    if (this.mode === GameMode.Classic) {
      // Add Walls
      this.board.forEach((row, index) => {
        if (index === 0 || index === this.BOARD_SIZE - 1) {
          row.fill({type: ItemType.Wall});
        } else {
          row[0] = {type: ItemType.Wall};
          row[this.BOARD_SIZE - 1] = {type: ItemType.Wall};
        }
      });
    } else if (this.mode === GameMode.Obstacles) {
      // Add Obstacles
      for (const _ of Array(this.OBSTACLES)) {
        this.addObstacle();
      }
    }

  }

  startGame(timestamp) {
    if (!this.gameOver && this.started && timestamp - this.lastUpdate > this.INTERVAL) {
      this.updateBoard(timestamp);
    }

    requestAnimationFrame(time => this.startGame(time));
  }

  updateBoard(timestamp) {
    this.lastUpdate = timestamp;
    this.updateSnake();
    this.drawBoard();
  }

  // Used to wrap snake.
  private clamp(i: number): number {
    // TODO: Disable clamping in 'walled' mode.
    if (i < 0) {
      return this.BOARD_SIZE + i;
    }

    return i % this.BOARD_SIZE;
  }

  updateSnake() {
    // TODO: This function should probably be split up.
    const body = [...this.snake.body];
    const {x: dx, y: dy} = this.snake.direction;

    // Add updated head to body
    const newHead: Segment = {
      point: {
        x: this.clamp(body[0].point.x + dx),
        y: this.clamp(body[0].point.y + dy)
      },
      orientation: dir(this.snake.direction)
    };
    body.unshift(newHead);

    // Get value of head on board
    const head = this.board[body[0].point.y][body[0].point.x];

    if (head.type !== ItemType.Fruit) {
      const tail = body.pop();
      this.board[tail.point.y][tail.point.x] = {type: ItemType.Blank};
    } else {
      // Remove fruit from board
      this.addFruit();
    }

    // End game if collision detected
    if (!this.checkCollision(body[0])) {
      return this.endGame();
    }

    this.snake.body = [...body];
  }

  addFruit() {
    // Remove old fruit
    this.board[this.fruit.y][this.fruit.x] = {type: ItemType.Blank};

    // Increment score, emit to parent
    this.score++;
    this.getScore.emit(this.score);

    // Generate new fruit
    const fruit = {
      x: Math.floor(Math.random() * this.BOARD_SIZE),
      y: Math.floor(Math.random() * this.BOARD_SIZE)
    };

    // Make sure fruit doesn't collide with snake
    while (this.board[fruit.y][fruit.x].type !== 0) {
      fruit.x = Math.floor(Math.random() * this.BOARD_SIZE);
      fruit.y = Math.floor(Math.random() * this.BOARD_SIZE);
    }

    this.fruit = {...fruit};
  }

  addObstacle() {
    // Generate new fruit
    const wall: Point = {x: 0, y: 0};
    do {
      wall.x = Math.floor(Math.random() * this.BOARD_SIZE);
      wall.y = Math.floor(Math.random() * this.BOARD_SIZE);
    } while (this.board[wall.y][wall.x].type !== 0);

    this.board[wall.y][wall.x] = {type: ItemType.Wall};
  }

  checkCollision(head: Segment) {
    const {x, y} = head.point;
    const size = this.BOARD_SIZE - 1;

    // Make sure position is inbounds.
    if (x < 0 || x > size || y < 0 || y > size) {
      return false;
    }

    // Make sure position not already occupied.
    return this.board[y][x].type <= 0;
  }


  drawBoard() {
    const board = this.board;

    // Draw snake
    let lastOrientation = this.snake.body[0].orientation;
    this.snake.body.forEach((pos, index) => {
      board[pos.point.y][pos.point.x] = {
        type: getType(index, this.snake.body.length, lastOrientation, pos.orientation),
        orientation: lastOrientation
      };
      lastOrientation = pos.orientation;
    });

    // Draw fruit
    board[this.fruit.y][this.fruit.x] = {type: ItemType.Fruit};

    this.board = [...board];
  }


  endGame() {
    this.gameOver = true;
    this.started = false;
  }
}

// Utility methods

function validDirection(oldDirection: Point, newDirection: Point) {
  if (!oldDirection || !newDirection || oldDirection === newDirection) {
    return false;
  }

  return (-oldDirection.x !== newDirection.x && -oldDirection.y !== newDirection.y);
}

function dir(direction: Direction): string {
  return direction.y ? (direction.y < 0 ? 'up' : 'down') : (direction.x < 0 ? 'left' : 'right');
}

function getType(index: number, size: number, to: string, from: string) {
  if (index === 0) {
    return ItemType.Head;
  }

  if (index === size - 1) {
    return ItemType.Tail;
  }

  if (to === from) {
    return ItemType.Body;
  }

  if (to === 'up') {
    return from === 'left' ? ItemType.RightTurn : ItemType.LeftTurn;
  }

  if (to === 'left') {
    return from === 'down' ? ItemType.RightTurn : ItemType.LeftTurn;
  }

  if (to === 'down') {
    return from === 'right' ? ItemType.RightTurn : ItemType.LeftTurn;
  }

  return from === 'up' ? ItemType.RightTurn : ItemType.LeftTurn;
}

// TODO move interface to their own files
interface Point {
  x: number;
  y: number;
}

interface Direction extends Point {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
}

interface Segment {
  point: Point;
  orientation: string;
}

interface BoardItem {
  type: ItemType;
  orientation?: string;
}

export enum ItemType {
  Fruit = -1,
  Blank = 0,
  Head,
  Body,
  LeftTurn,
  RightTurn,
  Tail,
  Wall
}

const Directions: { [dir: string]: Direction } = {
  up: {y: -1, x: 0},
  right: {y: 0, x: 1},
  down: {y: 1, x: 0},
  left: {y: 0, x: -1}
};
