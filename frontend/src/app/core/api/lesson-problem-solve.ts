import { Lesson } from './lesson';

export interface LessonProblemSolve {
  id: string;
  lesson: Lesson;
  correct_answer: number;
  wrong_answer: number;
  empty_answer: number;
  total_time: number;
  date: Date;
}
