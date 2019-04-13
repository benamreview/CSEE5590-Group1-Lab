import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() { return this.registerForm.controls; }

  register() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const user = this.registerForm.value;
    console.log('user', user);
    this.userService.register({user}).subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        console.error(err);
      }
    );
  }

}
