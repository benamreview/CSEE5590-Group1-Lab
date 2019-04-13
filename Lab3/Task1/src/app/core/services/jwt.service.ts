import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  private storage = window.localStorage;

  getToken(): string {
    return this.storage.jwtToken;
  }

  saveToken(token: string) {
    this.storage.jwtToken = token;
  }

  destroyToken() {
    this.storage.removeItem('jwtToken');
  }

}
