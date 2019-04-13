import { Component, OnInit } from '@angular/core';
import {UserService} from '../core/services/user.service';
import {User} from '../core/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Get user details
    this.userService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

}
