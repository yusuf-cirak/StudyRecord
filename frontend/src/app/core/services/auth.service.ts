import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { LoginUser } from '../contracts/user/login-user';
import { RegisterUser } from '../contracts/user/register-user';
import { UserResponse } from '../contracts/user/user-response';
import { User } from '../api/user';
import { Observable, map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private httpClientService: HttpClientService) {}

  login(body: LoginUser): Observable<User> {
    return this.httpClientService
      .post<UserResponse>({ controller: 'auth', action: 'login' }, body)
      .pipe(
        map((response) => {
          return {
            id: response.user.id,
            firstName: response.user.first_name,
            lastName: response.user.last_name,
            userName: response.user.user_name,
            photo: response.user.photo,
          } as User;
        })
      );
  }

  register(body: RegisterUser): Observable<User> {
    return this.httpClientService
      .post<UserResponse>({ controller: 'auth', action: 'register' }, body)
      .pipe(
        map((response) => {
          return {
            id: response.user.id,
            firstName: response.user.first_name,
            lastName: response.user.last_name,
            userName: response.user.user_name,
            photo: response.user.photo,
          } as User;
        })
      );
  }
}
