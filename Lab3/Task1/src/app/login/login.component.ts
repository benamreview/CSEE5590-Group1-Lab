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
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value;
    console.log('credentials ', credentials);
    this.userService.login(credentials).subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        console.log('Login Error');
        console.error(err);
      }
    );
  }

}
