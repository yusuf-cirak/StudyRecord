import { LessonProblemSolveService } from './../../../services/lesson-problem-solve.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/core/api/lesson';

@Component({
  selector: 'app-lesson-problem-solve-show',
  templateUrl: './lesson-problem-solve-show.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class LessonProblemSolveShowPage implements OnInit {
  form!: FormGroup;
  id = '';

  lessons: Lesson[] = [];
  constructor(
    private lpsService: LessonProblemSolveService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      lesson_id: ['', [Validators.required]],
      correct_answer: [null, [Validators.required, Validators.min(1)]],
      wrong_answer: [null, [Validators.required, Validators.min(1)]],
      empty_answer: [null, [Validators.required, Validators.min(1)]],
      total_time: [null, [Validators.required, Validators.min(1)]],
    });

    this.lessons = this.route.snapshot.data['lessons'];

    const lessonProblemSolve = this.route.snapshot.data[
      'lessonProblemSolve'
    ] as any;
    if (lessonProblemSolve) {
      this.id = lessonProblemSolve.id;
      this.form.patchValue({ ...lessonProblemSolve });
    }
  }

  save(formValues: any) {
    if (this.id) {
      this.lpsService.update(formValues).subscribe({
        next: () => {
          this.router.navigate(['/lesson-problem-solve-list']);
        },
      });
    } else {
      this.lpsService.create(formValues).subscribe({
        next: () => {
          this.router.navigate(['/lesson-problem-solve-list']);
        },
      });
    }
  }
}
