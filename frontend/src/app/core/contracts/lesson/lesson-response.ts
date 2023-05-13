import { ApiResponse } from '../../api/api-response';
import { Lesson } from '../../api/lesson';

export interface LessonResponse extends ApiResponse {
  data: Lesson | Lesson[];
}
