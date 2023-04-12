import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { LoginUser } from '../contracts/auth/login-user';
import { RegisterUser } from '../contracts/auth/register-user';

@Injectable()
export class AuthService {
  constructor(private httpClientService: HttpClientService) {}

  login(body: LoginUser) {
    return this.httpClientService.post(
      { controller: 'auth', action: 'login' },
      body
    );
  }

  register(body: RegisterUser) {
    return this.httpClientService.post(
      { controller: 'auth', action: 'register' },
      body
    );
  }
}
