import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  f: any;
  // Display form changes
  // username: string;
  // password: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      floatLabel: 'auto'
    });
  }

  // Check user is in db (registered), login
  // login(model: User, isValid: boolean) {
  //   this.submitted = true;
  //
  //   console.log(model, isValid);
  // }

  login() {
    // Do something
    return;
  }

}
