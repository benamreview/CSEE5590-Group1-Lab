import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../core/services/user.service';

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

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
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
    const credentials = this.loginForm.value;
    console.log('credentials ', credentials);
    this.userService.login(credentials).subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        console.error(err);
      }
    );
  }

}
