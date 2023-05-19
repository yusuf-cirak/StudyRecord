import { LessonProblemSolveService } from './../../../services/lesson-problem-solve.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonAlert, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LessonProblemSolve } from 'src/app/core/api/lesson-problem-solve';
import { Lesson } from 'src/app/core/api/lesson';

@Component({
  selector: 'app-lesson-problem-solve-list',
  templateUrl: './lesson-problem-solve-list.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class LessonProblemSolveListPage implements OnInit {
  private _lessonProblemSolves: LessonProblemSolve[] = [];
  lessonProblemSolves: LessonProblemSolve[] = [];

  public alertButtons: { text: string; role: string; cssClass: string }[] = [];

  selectedLessonProblemSolve!: LessonProblemSolve;

  operation = '';

  @ViewChild('alert') alert!: IonAlert;

  constructor(
    private lpsService: LessonProblemSolveService,
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
        const lessons = data['lessons'] as Lesson[];
        this._lessonProblemSolves = (
          data['lessonProblemSolves'] as any[]
        ).reduce((arr: LessonProblemSolve[], current: any) => {
          const { lesson_id, date, ...rest } = current;
          const lessonName = lessons.find(
            (lesson) => lesson.id === lesson_id
          )?.name;
          arr.push({
            ...rest,
            lesson: { id: lesson_id, name: lessonName } as Lesson,
            date: new Date(date).toLocaleDateString(),
          });

          return arr;
        }, []);
        this.lessonProblemSolves = [...this._lessonProblemSolves];
      },
    });
  }

  openAlert(lessonProblemSolve: LessonProblemSolve, operation: string) {
    this.operation = operation;
    this.selectedLessonProblemSolve = lessonProblemSolve;
    this.alert.message = `Are you sure you want to ${operation} selected problem solve data?`;
    this.alert.isOpen = true;
  }

  handleAlertClick(type: string) {
    this.alert.isOpen = false;
    if (type === 'confirm') {
      if (this.operation === 'delete') {
        this.lpsService.delete(this.selectedLessonProblemSolve.id).subscribe({
          next: () => {
            this._lessonProblemSolves = this._lessonProblemSolves.filter(
              (lps) => lps.id !== this.selectedLessonProblemSolve.id
            );
            this.lessonProblemSolves = [...this._lessonProblemSolves];
          },
        });
      } else {
        this.router.navigate([
          '',
          'lesson-problem-solve-show',
          this.selectedLessonProblemSolve.id,
        ]);
      }
    }
  }

  search(text: string) {
    if (!text) {
      this.lessonProblemSolves = [...this._lessonProblemSolves];
      return;
    }
    this.lessonProblemSolves = this._lessonProblemSolves.filter(
      (lessonProblemSolve) =>
        Object.entries(lessonProblemSolve).some(
          ([key, value]) =>
            value.toString().toLowerCase().includes(text.toLowerCase()) ||
            (key === 'lesson' ? (value as Lesson).name : '')
              .toLowerCase()
              .includes(text.toLowerCase())
        )
    );
  }
}
