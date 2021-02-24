import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  /*  -- Данные для графика продаж (sell) */

  sellChartData: ChartDataSets[] = [
    {
      data: [
        17000, 24000, 23000, 14200, 19600, 29000, 42000, 31100, 28600, 44900, 18300, 27200, 30000, 8500, 41000
      ],
      label: 'Динамика продаж за 30 дней'
    }
  ];

  sellChartLabels: Label[] = [
    '11', '12', '13', '14', '15', '18', '19', '20', '21', '22', '25', '26', '27', '28', '29'
  ];

  sellChartOptions = {
    responsive: true
  };

  sellChartColors: Color[] = [
    {
      backgroundColor: 'transparent',
      borderColor: '#8e24aa'
    }
  ];

  sellChartLegend = true;
  sellChartPlugins: any[] = [];
  sellChartType: ChartType = 'line';

  /* Данные для графика продаж */

  constructor() { }

  ngOnInit(): void {
  }

}
