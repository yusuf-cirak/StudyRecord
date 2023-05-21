import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChartsDataService } from 'src/app/core/services/charts-data.service';
import { CHART_LABELS } from 'src/app/core/constants/chart.data';
import { EChartsOption, ECharts } from 'echarts';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-lesson-problem-solve-chart',
  templateUrl: './lesson-problem-solve-chart.page.html',
  styleUrls: ['./lesson-problem-solve-chart.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    IonicModule,
    ReactiveFormsModule,
    NgxEchartsModule,
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
})
export class LessonProblemSolveChartPage {
  lineChartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{c}',
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      data: CHART_LABELS,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
      },
      splitNumber: 4,
      axisLine: {
        show: false,
      },
    },
    grid: {
      left: '10%',
      right: '0%',
    },
    series: [
      {
        id: 'earnings',
        name: 'Earnings',
        type: 'line',
      },
      {
        id: 'revenue',
        name: 'Revenue',
        type: 'line',
        lineStyle: {
          color: '#CCC',
          type: 'dashed',
        },
      },
    ],
  };

  chartControlsGroup: FormGroup;

  echartsInstance!: ECharts;

  constructor(public chartsDataService: ChartsDataService) {
    this.chartControlsGroup = new FormGroup({
      earningsData: new FormControl(true, Validators.required),
      revenueData: new FormControl(true, Validators.required),
      smoothLine: new FormControl(true, Validators.required),
      dataPeriod: new FormControl('thisWeek', Validators.required),
    });

    // ? Get initial value to set the curve style
    const isSmooth = this.chartControlsGroup.get('smoothLine')?.value;

    (this.lineChartOptions.series as any)[0].smooth = isSmooth;
    (this.lineChartOptions.series as any)[1].smooth = isSmooth;

    // ? Check what series we should show in the chart
    const showEarnings = this.chartControlsGroup.get('earningsData')?.value;
    const showRevenue = this.chartControlsGroup.get('revenueData')?.value;
    // ? Check what period of data we should show in the chart
    const dataPeriod = this.chartControlsGroup.get('dataPeriod')?.value;

    const dataCategory =
      showEarnings & showRevenue
        ? 'all'
        : showEarnings
        ? 'earnings'
        : showRevenue
        ? 'revenue'
        : null;

    if (dataCategory !== null && dataPeriod) {
      const chartData = this.chartsDataService.getData(
        dataPeriod,
        dataCategory,
        'ngx-echarts'
      );

      (this.lineChartOptions.series as any)[0].data = chartData[0].data;
      (this.lineChartOptions.series as any)[1].data = chartData[1].data;
    }

    // Start listening for changes in the form
    this.onChanges();
  }

  // Get Echarts instance: https://github.com/xieziyu/ngx-echarts#echarts-instance
  onChartInit(chart: ECharts) {
    this.echartsInstance = chart;
  }

  onChanges(): void {
    this.chartControlsGroup
      .get('smoothLine')
      ?.valueChanges.subscribe((isSmooth) => {
        console.log('smoothLine', isSmooth);

        this.echartsInstance?.setOption({
          series: [
            {
              id: 'earnings',
              smooth: isSmooth,
            },
            {
              id: 'revenue',
              smooth: isSmooth,
            },
          ],
        });
      });

    this.chartControlsGroup
      .get('dataPeriod')
      ?.valueChanges.subscribe((dataPeriod) => {
        console.log('dataPeriod', dataPeriod);

        // ? Check what series we should show in the chart
        const showEarnings = this.chartControlsGroup.get('earningsData')?.value;
        const showRevenue = this.chartControlsGroup.get('revenueData')?.value;

        const dataCategory =
          showEarnings & showRevenue
            ? 'all'
            : showEarnings
            ? 'earnings'
            : showRevenue
            ? 'revenue'
            : null;

        if (dataCategory !== null) {
          const chartData = this.chartsDataService.getData(
            dataPeriod,
            dataCategory,
            'ngx-echarts'
          );

          switch (dataCategory) {
            case 'all':
              this.echartsInstance?.setOption({
                series: [
                  {
                    id: 'earnings',
                    data: chartData[0].data,
                  },
                  {
                    id: 'revenue',
                    data: chartData[1].data,
                  },
                ],
              });

              break;
            case 'earnings':
              this.echartsInstance?.setOption({
                series: [
                  {
                    id: 'earnings',
                    data: chartData.data,
                  },
                ],
              });

              break;
            case 'revenue':
              this.echartsInstance?.setOption({
                series: [
                  {
                    id: 'revenue',
                    data: chartData.data,
                  },
                ],
              });

              break;
          }
        }
      });

    // See: https://github.com/apache/echarts/issues/15585
    // See: https://echarts.apache.org/en/api.html#echartsInstance.setOption
    // Live data, we can also use: https://echarts.apache.org/en/api.html#echartsInstance.appendData
    this.chartControlsGroup
      .get('earningsData')
      ?.valueChanges.subscribe((toggleEarningsData) => {
        console.log('toggleEarningsData', toggleEarningsData);

        // ? Check what period of data we should show in the chart
        const dataPeriod = this.chartControlsGroup.get('dataPeriod')?.value;

        const earningsData = toggleEarningsData
          ? this.chartsDataService.getData(
              dataPeriod,
              'earnings',
              'ngx-echarts'
            ).data
          : [];

        this.echartsInstance.setOption({
          series: [
            {
              id: 'earnings',
              data: earningsData,
            },
          ],
        });
      });

    this.chartControlsGroup
      .get('revenueData')
      ?.valueChanges.subscribe((toggleRevenueData) => {
        console.log('toggleRevenueData', toggleRevenueData);

        // ? Check what period of data we should show in the chart
        const dataPeriod = this.chartControlsGroup.get('dataPeriod')?.value;

        const revenueData = toggleRevenueData
          ? this.chartsDataService.getData(dataPeriod, 'revenue', 'ngx-echarts')
              .data
          : [];

        this.echartsInstance.setOption({
          series: [
            {
              id: 'revenue',
              data: revenueData,
            },
          ],
        });
      });
  }
}
