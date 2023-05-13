import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonAlert, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Lesson } from 'src/app/core/api/lesson';
import { LessonService } from 'src/app/core/services/lesson.service';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class LessonListPage implements OnInit {
  private _lessons: Lesson[] = [];
  lessons: Lesson[] = [];

  public alertButtons: { text: string; role: string; cssClass: string }[] = [];

  selectedLesson!: Lesson;

  operation = '';

  @ViewChild('alert') alert!: IonAlert;

  constructor(
    private lessonService: LessonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.alertButtons = [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'Yes',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
      },
    ];

    this.route.data.subscribe({
      next: (data) => {
        this._lessons = data['lessons'];
        this.lessons = [...this._lessons];
      },
    });
  }

  openAlert(lesson: Lesson, operation: string) {
    this.operation = operation;
    this.selectedLesson = lesson;
    this.alert.message = `Are you sure you want to ${operation} ${lesson.name}?`;
    this.alert.isOpen = true;
  }

  handleAlertClick(type: string) {
    this.alert.isOpen = false;
    if (type === 'confirm') {
      if (this.operation === 'delete') {
        this.lessonService.delete(this.selectedLesson.id).subscribe({
          next: () => {
            this._lessons = this._lessons.filter(
              (book) => book.id !== this.selectedLesson.id
            );
            this.lessons = [...this._lessons];
          },
        });
      } else {
        this.router.navigate(['', 'lesson-show', this.selectedLesson.id]);
      }
    }
  }

  search(value: string) {
    if (!value) {
      this.lessons = [...this._lessons];
      return;
    }
    this.lessons = this._lessons.filter((book) => book.name.includes(value));
  }
}
