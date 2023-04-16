import { ApiResponse } from '../../api/api-response';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  photo: string;
}

export interface UserResponse extends ApiResponse {
  user: User;
}
