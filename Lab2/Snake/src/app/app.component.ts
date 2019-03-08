import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Snake';
  currScore = 0;
  highScore = 0;

  setScore(score: number) {
    this.currScore = score;

    if (score > this.highScore)
      this.highScore = score;

    console.log(this.currScore);
  }
}
