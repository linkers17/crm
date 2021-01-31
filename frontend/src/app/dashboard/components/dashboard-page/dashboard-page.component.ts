import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartType} from "chart.js";
import {Color, Label} from "ng2-charts";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /*  -- Данные для графика продаж (sell) */

  sellChartData: ChartDataSets[] = [
    {
      data: [
        17000, 15000, 27000, 34200, 14600, 29000, 42000, 31100, 28600, 44900
      ],
      label: 'Продажи за текущий месяц'
    }
  ];

  sellChartLabels: Label[] = [
    '11', '12', '13', '14', '15', '18', '19', '20', '21', '22'
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

  /*  -- Данные для графика заказов (sell) */

  orderChartData: ChartDataSets[] = [
    {
      data: [
        1, 1, 2, 3, 2, 2, 3, 2, 3, 4
      ],
      label: 'Успешные сделки за текущий месяц'
    },
    {
      data: [
        0, 1, 0, 0, 0, 2, 0, 1, 0, 1
      ],
      label: 'Провальные сделки за текущий месяц'
    }
  ];

  orderChartLabels: Label[] = [
    '11', '12', '13', '14', '15', '18', '19', '20', '21', '22'
  ];

  orderChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    }
  };

  orderChartColors: Color[] = [
    {
      backgroundColor: '#43a047'
    },
    {
      backgroundColor: '#e53935'
    }
  ];

  orderChartLegend = true;
  orderChartPlugins: any[] = [];
  orderChartType: ChartType = 'bar';

  /* Данные для графика заказов */

}
