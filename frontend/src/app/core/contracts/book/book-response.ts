import { ApiResponse } from '../../api/api-response';
import { Book } from '../../api/book';

export interface BookResponse extends ApiResponse {
  data: Book | Book[];
}
