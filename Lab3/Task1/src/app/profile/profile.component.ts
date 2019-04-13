import { Component, OnInit } from '@angular/core';
import {UserService} from '../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  firstName: string;
  lastName: string;
  email: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Get user details
    this.userService.currentUser.subscribe(user => {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
    });
  }

}
