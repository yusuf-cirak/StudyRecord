import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartsDataService {
  getWeeklyData(datas: any[]) {
    const thisWeek = this.getCurrentMonthAndYear().find(
      (week) => week.weekNumber === this.getCurrentWeek()
    )!;

    const filteredData = datas.filter((data) => {
      const date = new Date(data.date);
      return date >= thisWeek.startDate && date <= thisWeek.endDate;
    });
    console.log(filteredData);

    return filteredData;
  }

  getMonthlyData(datas: any[]) {
    const thisMonth = this.getCurrentMonthAndYear();

    const filteredData: any[] = [];
    thisMonth.forEach((week) => {
      const weekData = datas.filter((data) => {
        const date = new Date(data.date);
        return date >= week.startDate && date <= week.endDate;
      });
      filteredData.push(weekData);
    });
    console.log(filteredData);
    return filteredData;
  }

  getYearlyData(datas: any[]) {
    const thisYear = new Date(Date.now()).getFullYear();

    const filteredData: any[] = Array(12)
      .fill([])
      .map(() => []);

    datas.forEach((data) => {
      const thisMonth = new Date(data.date).getMonth();
      if (data.date.includes(thisYear.toString())) {
        const thisMonthArr = filteredData[thisMonth];
        if (!thisMonthArr) {
          filteredData[thisMonth] = [data];
        } else {
          filteredData[thisMonth].push(data);
        }
      }
    });
    return filteredData;
  }

  private getWeekNumber(date: Date) {
    // Copy date so it's not modified
    const copiedDate = new Date(date.getTime());
    copiedDate.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year
    copiedDate.setDate(
      copiedDate.getDate() + 3 - ((copiedDate.getDay() + 6) % 7)
    );

    // January 4th is always in week 1
    const week1 = new Date(copiedDate.getFullYear(), 0, 4);

    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const daysDiff = Math.round(
      (copiedDate.getTime() - week1.getTime()) / oneDay
    );

    // Calculate the week number
    return Math.ceil((daysDiff + (week1.getDay() + 1 - 1)) / 7);
  }

  private getWeeksInMonth(year: number, month: number) {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the first week number of the month
    let weekNumber = this.getWeekNumber(firstDay);

    // Iterate through each day of the month
    let currentDay = firstDay;
    while (currentDay <= lastDay) {
      const week = {
        weekNumber: weekNumber,
        startDate: new Date(currentDay),
        endDate: new Date(currentDay),
      };

      // Find the end date of the week (Sunday)
      week.endDate.setDate(currentDay.getDate() + (7 - currentDay.getDay()));

      // Move to the next week
      currentDay = new Date(week.endDate.getTime() + 86400000); // Add 1 day
      weekNumber++;

      // Push the week data to the array
      weeks.push(week);
    }

    return weeks;
  }

  private getCurrentMonthAndYear() {
    // Get the current month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Get the weeks in the current month
    const weeksInCurrentMonth = this.getWeeksInMonth(currentYear, currentMonth);

    // Print the week numbers and their start/end dates
    weeksInCurrentMonth.forEach((week) => {
      console.log(
        'Week ' +
          week.weekNumber +
          ': ' +
          week.startDate.toDateString() +
          ' - ' +
          week.endDate.toDateString()
      );
    });

    return weeksInCurrentMonth;
  }

  private getCurrentWeek() {
    // Create a new Date object for the current date
    const currentDate: Date = new Date();

    // Set the first day of the week (0 - Sunday, 1 - Monday, etc.)
    const firstDayOfWeek: number = 1; // Assuming Monday is the first day of the week

    // Get the current day of the week (0 - Sunday, 1 - Monday, etc.)
    const currentDayOfWeek: number = currentDate.getDay();

    // Calculate the difference in days between the current day and the first day of the week
    const diff: number =
      currentDayOfWeek >= firstDayOfWeek
        ? currentDayOfWeek - firstDayOfWeek
        : 6 - currentDayOfWeek;

    // Set the date to the first day of the week
    currentDate.setDate(currentDate.getDate() - diff);

    // Get the year
    const year: number = currentDate.getFullYear();

    // Get the month (0 - January, 1 - February, etc.)
    const month: number = currentDate.getMonth();

    // Get the day of the month
    const day: number = currentDate.getDate();

    // Create a new Date object for the first day of the year
    const firstDayOfYear: Date = new Date(year, 0, 1);

    // Calculate the number of days between the first day of the year and the first day of the week
    const days: number = Math.round(
      (currentDate.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate the week number
    const weekNumber: number = Math.ceil(
      (days + firstDayOfYear.getDay() + 1) / 7
    );

    console.log('Current week number:', weekNumber);
    return weekNumber;
  }

  getDataFor(array: any[], key: string, isPeriodYear: boolean = false) {
    if (isPeriodYear) {
      const newArr: any[] = [];
      array.forEach((arr) => {
        const currentMonthValues =
          (arr.reduce((arr2: any, val2: any) => {
            arr2.push(val2[key]);
            return arr2;
          }, []) as number[]) || [];
        const sumOfMonth =
          currentMonthValues.reduce((sum, val) => sum + val, 0) || 0;
        newArr.push(sumOfMonth);
      });

      return newArr;
    }
    return array.reduce((newArr, cur) => {
      if (cur instanceof Array) {
        const valueArray = (cur as any[]).reduce((arr2, val2) => {
          arr2.push(val2[key]);
          return arr2;
        }, []);
        newArr.push(valueArray);
      } else {
        newArr.push(cur[key]);
      }

      return newArr;
    }, []);
  }
}
