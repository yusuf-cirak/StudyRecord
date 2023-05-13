import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/shared/services/http-client.service';
import { UpdateUser } from '../contracts/user/update-user';
import { ApiResponse } from '../api/api-response';
import { map } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private httpClientService: HttpClientService) {}

  update(body: UpdateUser) {
    return this.httpClientService.put<ApiResponse>(
      { controller: 'users', action: 'me' },
      body
    );
  }
}
