import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  firstName: string;
  lastName: string;
  email: string;

  constructor() { }

  ngOnInit() {
    // Get user details
    this.firstName = 'Evan';
    this.lastName = 'Wike';
    this.email = 'evwxtd@mail.umkc.edu';
  }

}
