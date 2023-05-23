import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartModule } from 'primeng/chart';
import { Lesson } from 'src/app/core/api/lesson';
import { ActivatedRoute } from '@angular/router';
import { ChartsDataService } from 'src/app/core/services/charts-data.service';
import { LessonProblemSolve } from 'src/app/core/api/lesson-problem-solve';

@Component({
  selector: 'app-lesson-problem-solve-chart',
  templateUrl: './lesson-problem-solve-chart.page.html',
  styleUrls: ['./lesson-problem-solve-chart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, ChartModule],
})
export class LessonProblemSolveChartPage implements OnInit {
  chartData: any;

  lessonProblemSolveDatas: any;

  options: any;

  lessons: Lesson[] = [];
  selectedLessons: Lesson[] = [];

  timePeriods: string[] = [];

  timePeriodLabels: { [key: string]: string[] } = {};

  form: FormGroup;

  documentStyle = getComputedStyle(document.documentElement);

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private chartDataService: ChartsDataService
  ) {
    this.timePeriods = ['This Week', 'This Month', 'This Year'];
    this.timePeriodLabels = {
      'This Week': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      'This Month': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      'This Year': [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'Septemper',
        'October',
        'November',
        'December',
      ],
    };
    this.form = this.formBuilder.group({
      lessons: [[]],
      timePeriod: ['This Year'],
    });
  }

  ngOnInit() {
    this.lessons = this.route.snapshot.data['lessons'];
    this.form.controls['lessons'].setValue(this.lessons.map((l) => l.id));

    this.lessonProblemSolveDatas = this.route.snapshot.data[
      'lessonProblemSolves'
    ] as LessonProblemSolve[];

    this.initializeChart();
    this.updateChartData();

    this.form.controls['lessons'].valueChanges.subscribe(() => {
      this.updateChartData();
    });

    this.form.controls['timePeriod'].valueChanges.subscribe(() => {
      this.updateChartData();
    });
  }

  private initializeChart() {
    const textColor = this.documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = this.documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder =
      this.documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: [...this.timePeriodLabels['This Year']],
      datasets: [
        {
          label: 'Correct Answers',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: 0.4,
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),
        },
        {
          label: 'Wrong Answers',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: this.documentStyle.getPropertyValue('--teal-500'),
        },
        {
          label: 'Empty Answers',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: this.documentStyle.getPropertyValue('--orange-500'),
          tension: 0.4,
          backgroundColor: 'rgba(255,167,38,0.2)',
        },
        {
          label: 'Total Time',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: this.documentStyle.getPropertyValue('--orange-500'),
          tension: 0.4,
          backgroundColor: 'rgba(255,167,38,0.2)',
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  private updateChartData() {
    const selectedTimePeriod = this.form.controls['timePeriod'].value;
    const selectedLessons = this.form.controls['lessons'].value;
    // When value changes, update the chart datas
    let filteredData = [];
    const lspData = this.lessonProblemSolveDatas.filter((lsp: any) =>
      selectedLessons.includes(lsp.lesson_id)
    );
    if (selectedTimePeriod === 'This Week') {
      filteredData = this.chartDataService.getWeeklyData(lspData);
    } else if (selectedTimePeriod === 'This Month') {
      filteredData = this.chartDataService.getMonthlyData(lspData);
    } else {
      filteredData = this.chartDataService.getYearlyData(lspData);
    }

    const isPeriodYear = selectedTimePeriod === 'This Year';

    // When value changes, update the chart labels
    const correctAnswers = {
      label: 'Correct Answers',
      data: this.chartDataService.getDataFor(
        filteredData,
        'correct_answer',
        isPeriodYear
      ),
      fill: false,
      tension: 0.4,
      borderColor: this.documentStyle.getPropertyValue('--blue-500'),
    };
    const wrongAnswers = {
      label: 'Wrong Answers',
      data: this.chartDataService.getDataFor(
        filteredData,
        'wrong_answer',
        isPeriodYear
      ),
      fill: false,
      borderDash: [5, 5],
      tension: 0.4,
      borderColor: this.documentStyle.getPropertyValue('--teal-500'),
    };
    const emptyAnswers = {
      label: 'Empty Answers',
      data: this.chartDataService.getDataFor(
        filteredData,
        'empty_answer',
        isPeriodYear
      ),
      fill: false,
      borderColor: this.documentStyle.getPropertyValue('--orange-500'),
      tension: 0.4,
      backgroundColor: 'rgba(255,167,38,0.2)',
    };
    const totalTimes = {
      label: 'Total Time',
      data: this.chartDataService.getDataFor(
        filteredData,
        'total_time',
        isPeriodYear
      ),
      fill: true,
      borderColor: this.documentStyle.getPropertyValue('--red-500'),
      tension: 0.4,
      backgroundColor: 'rgba(104,167,25,0.2)',
    };
    const labels = this.timePeriodLabels[selectedTimePeriod];

    const datasets = [correctAnswers, wrongAnswers, emptyAnswers, totalTimes];
    this.chartData = {
      ...this.chartData,
      labels,
      datasets,
    };
    console.log(this.chartData);
  }
}
