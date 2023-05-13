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
import { LessonService } from 'src/app/core/services/lesson.service';
import { Lesson } from 'src/app/core/api/lesson';

@Component({
  selector: 'app-lesson-show',
  templateUrl: './lesson-show.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class LessonShowPage implements OnInit {
  form!: FormGroup;
  id = '';
  constructor(
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      lesson_id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });

    const lesson = this.route.snapshot.data['lesson'] as Lesson;
    if (lesson) {
      this.id = lesson.id;
      this.form.patchValue({ lesson_id: lesson.id, name: lesson.name });
    }
  }

  save(formValues: Lesson) {
    if (this.id) {
      this.lessonService.update(formValues).subscribe({
        next: () => {
          this.router.navigate(['/lesson-list']);
        },
      });
    } else {
      this.lessonService.create(formValues).subscribe({
        next: () => {
          this.router.navigate(['/lesson-list']);
        },
      });
    }
  }
}
