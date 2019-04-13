import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../core/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public profileForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]]
    });
    this.userService.currentUser.subscribe(user => {
      this.profileForm.patchValue(user);
    });
  }

  update() {
    const user = this.profileForm.value;
    console.log('user', user);
    this.userService.update(user).subscribe(
      data => this.router.navigateByUrl('/'),
      err => {
        console.error(err);
      }
    );
  }
}
