import {Component, OnInit} from '@angular/core';
import {UserService} from './core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Task1';

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userService.init();
  }

  logout(): void {
    console.log('Logging out...');
    this.userService.reset();
    this.router.navigateByUrl('/login').then(() => {
      console.log('Logged out.');
    });
  }
}
