export interface UpdateLessonProblemSolve {
  id: string;
  lesson_id: string;
  correct_answer: number;
  wrong_answer: number;
  empty_answer: number;
  total_time: number;
}
