import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { LoginUser } from '../contracts/user/login-user';
import { RegisterUser } from '../contracts/user/register-user';
import { UserResponse } from '../contracts/user/user-response';
import { User } from '../api/user';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = false;
  constructor(private httpClientService: HttpClientService) {}

  login(body: LoginUser): Observable<User> {
    return this.httpClientService
      .post<UserResponse>({ controller: 'auth', action: 'login' }, body)
      .pipe(
        map((res) => {
          return {
            id: res.user.id,
            firstName: res.user.first_name,
            lastName: res.user.last_name,
            userName: res.user.user_name,
          } as User;
        })
      );
  }

  register(body: RegisterUser): Observable<User> {
    return this.httpClientService
      .post<UserResponse>({ controller: 'auth', action: 'register' }, body)
      .pipe(
        map((res) => {
          return {
            id: res.user.id,
            firstName: res.user.first_name,
            lastName: res.user.last_name,
            userName: res.user.user_name,
          } as User;
        })
      );
  }

  checkClientHasToken(): Observable<User> {
    return this.httpClientService
      .get<UserResponse>({
        controller: 'users',
        action: 'me',
      })
      .pipe(
        map((res) => {
          return {
            id: res.user.id,
            firstName: res.user.first_name,
            lastName: res.user.last_name,
            userName: res.user.user_name,
            photo: res.user.photo,
          } as User;
        })
      );
  }
}
