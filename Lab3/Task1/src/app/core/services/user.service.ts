import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {map} from 'rxjs/operators';
import {JwtService} from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {
  }

  init() {
    if (this.jwtService.getToken()) {
      this.apiService.get('/user').subscribe(
        data => this.setAuth(data.user),
        err => this.reset()
      );
    } else {
      this.reset();
    }
  }

  setAuth(user: User) {
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  reset() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials): Observable<User> {
    return this.apiService.post('/users/login', credentials)
      .pipe(map(
        data => {
          this.setAuth(data.user);
          return data;
        }
      ));
  }

  register(user): Observable<User> {
    return this.apiService.post('/users', user)
      .pipe(map(
        data => {
          this.setAuth(data.user);
          return data;
        }
      ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  update(user): Observable<User> {
    return this.apiService
      .put('/user', {user})
      .pipe(map(data => {
        // Update the currentUser observable
        this.currentUserSubject.next(data.user);
        return data.user;
      }));
  }

}
