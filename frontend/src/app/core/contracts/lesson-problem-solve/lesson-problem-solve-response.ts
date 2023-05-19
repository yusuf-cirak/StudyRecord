import { ApiResponse } from '../../api/api-response';

interface LessonProblemSolve {
  id: string;
  lesson_id: string;
  correct_answer: number;
  wrong_answer: number;
  empty_answer: number;
  total_time: number;
  date: Date;
}

export interface LessonProblemSolveResponse extends ApiResponse {
  data: LessonProblemSolve | LessonProblemSolve[];
}
