import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService, FuseConfirmationConfig } from '@fuse/services/confirmation';
import { GridOptions, ColDef, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { RenderActionButtonsComponent } from 'app/shared/components/render-action-buttons/render-action-buttons.component';
import { IAction } from 'app/shared/interfaces/ag-grid.interface';
import { Restangular } from 'ngx-restangular';
import { ManagerService } from '../../../example/manager/manager.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { MatTabChangeEvent } from '@angular/material/tabs';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'admin-record-charges',
  templateUrl: './record-charges.component.html',
  styleUrls: ['./record-charges.component.scss']
})
export class RecordChargesComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;

  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public context: any;
  public actions: Array<IAction> = [];
  public totalValue: Number = 0;
  public activeTab: number = 0;
  public isChartReady: boolean = true;

  //ARRAYS
  public recordCharges: Array<any> = [];

  //FORMS
  public dateRangeForm: FormGroup;

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public recordChargesCols: Array<ColDef> = []
  public gridApiRecordCharges!: GridApi;
  public gridColumnApiRecordCharges!: ColumnApi;

  //CHART
  public chartOptions: Partial<ChartOptions>;

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public managerService: ManagerService,
    private fuseConfigService: FuseConfigService,
    public fuseAlertService: FuseAlertService,
    public fuseConfirmationService: FuseConfirmationService,
    @Inject(Restangular) public restangular,
  ) {
    this.defaultColDef = defaultColDef
    this.renderComponents = {
      'renderActionButtons': RenderActionButtonsComponent
    };

    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiRecordCharges.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }

    this.context = {
      componentParent: this
    }

    this.actions = [
      {
        id: 1,
        name: 'edit',
        icon: 'edit',
        tooltip: 'Edit',
        functionName: 'openDialogCharge',
        disableIf: {
          param: 'state',
          operator: '===',
          condition: 1
        }
      },
      {
        id: 2,
        name: 'delete',
        icon: 'delete',
        tooltip: 'Delete',
        functionName: 'deleteCharge'
      }
    ]

    this.recordChargesCols = [
      { field: 'id', hide: true },
      { field: 'fecha', headerName: 'Fecha', width: 50 },
      {
        field: "Detalle",
        valueGetter: params => {
          let detail: string = '';
          for (let index = 0; index < params.data.data.length; index++) {
            const element = params.data.data[index];
            detail = `${detail} ${element.nombre} $ ${element.total} ::`
            // detail = detail + ' ' + element.nombre + ' ' + '$' + element.total + ' ::'
          }
          return detail;
        }
      }
      // { field: 'fechaFin' },
      // { field: 'valorRecaudado' }
      // {
      //   field: "Actions",
      //   cellRenderer: 'renderActionButtons',
      //   wrapText: true,
      //   autoHeight: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     actions: this.actions
      //   }
      // }
    ];

    this.chartOptions = {
      series: [
        {
          name: "",
          data: []
        },
      ],
      chart: {
        type: "bar",
        height: 400
      }
    }

    this.fuseConfigService.config$.subscribe((data) => {
      data.scheme === 'dark' ? this.gridTheme = 'ag-theme-alpine-dark' : this.gridTheme = 'ag-theme-alpine'
    })
  }

  ngOnInit(): void {
    this.dateRangeForm = this.createFormDateRange();
  }

  createFormDateRange() {
    return this.fb.group({
      fechaInicio: [],
      fechaFin: []
    })
  }

  getRecordCharges() {
    this.isLoading = true;
    this.isChartReady = false;
    this.gridApiRecordCharges !== undefined ? this.gridApiRecordCharges.showLoadingOverlay() : null;
    this.restangular.one('historialCobroGarita').all('cobrosVehiculos').customPOST(this.dateRangeForm.value).subscribe((data) => {
      this.gridApiRecordCharges.hideOverlay();
      this.isLoading = false;
      this.recordCharges = data.data;
      this.totalValue = data.data.total;
      this.createChart(this.recordCharges);
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  async downloadPDF() {
    let body: Array<Array<any>> = [
      [{ text: 'Fecha', style: 'tableHeader' },
      { text: 'Detalle', style: 'tableHeader' }]];
    let item: Array<any> = [];
    for (let index = 0; index < this.recordCharges.length; index++) {
      const recordCharge = this.recordCharges[index];
      item = [];
      let detail: string = '';
      for (let index = 0; index < recordCharge.data.length; index++) {
        const element = recordCharge.data[index];
        detail = `${detail} ${element.nombre} $ ${element.total} ::`
      }
      item.push(recordCharge.fecha, detail);
      body.push(item);
    }
    let dd = {
      content: [
        {
          style: 'header',
          table: {
            widths: ['*'],
            body: [
              [{ text: 'Secretaría Tecnica de Gestión Inmobilibaria del Sector Público', style: 'tableHeader', alignment: 'center' }],
              [{ text: 'Puerto Persquero Anconcito', style: 'tableHeader', alignment: 'center' }],
              [{ text: 'Historial de Cobros', style: 'tableHeader', alignment: 'center' }]
            ]
          }
        },
        {
          alignment: 'center',
          columns: [
            { text: 'Fecha Inicio: ' + this.dateRangeForm.get('fechaInicio').value.format("DD/MM/YYYY"), },
            { text: 'Fecha Fin: ' + this.dateRangeForm.get('fechaFin').value.format("DD/MM/YYYY"), },
          ]
        },
        {
          image: await this.getBase64Image(),
          width: 520
        },
        {
          style: 'horizontalTable',
          table: {
            widths: [75, '*'],
            headerRows: 2,
            body: body
          }
        },
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        horizontalTable: {
          margin: [0, 10, 0, 10]
        },
        header: {
          margin: [0, 0, 0, 20]
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: 'black'
        },
        footer: {
          fontSize: 14,
          bold: true,
          margin: [0, 2, 0, 0],
          alignment: 'right',
        },
      },
    }
    pdfMake.createPdf(dd).download();
  }

  getBase64Image() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgElement: SVGGraphicsElement =
        document.querySelector('.apexcharts-svg');
      const imageBlobURL =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(svgElement.outerHTML);
      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageBlobURL;
    });
  }

  createChart(recordCharges) {
    const categories: Array<any> = []
    for (const recordCharge of recordCharges) {
      categories.push(recordCharge.fecha)
    }

    let series: Array<any> = []
    for (let index = 0; index < recordCharges[0].data.length; index++) {
      const recordChargeSerie = recordCharges[0].data[index];
      const serie: object = {
        name: recordChargeSerie.nombre,
        data: []
      }
      series.push(serie);
    }

    for (let index = 0; index < recordCharges.length; index++) {
      const recordCharge = recordCharges[index];
      for (let index = 0; index < recordCharge.data.length; index++) {
        const recordChargeSerie = recordCharge.data[index];
        series[index].data.push(recordChargeSerie.total)
      }
    }

    this.chartOptions = {
      series: series,
      chart: {
        type: "bar",
        height: 400
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: categories
      },
      yaxis: {
        title: {
          text: "$ ( dolares )"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val;
          }
        }
      }
    };

    setTimeout(() => {
      this.isChartReady = true
    }, 2000);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.activeTab = tabChangeEvent.index;
  }

  onGridReadyRecordCharges(params: GridReadyEvent) {
    // console.log('EN GRID READY', params.api);
    this.gridApiRecordCharges = params.api;
    this.gridColumnApiRecordCharges = params.columnApi;
    // this.pagination ? this.getChargesPaginate() : this.getCharges();
  }

  errHandler(err: HttpErrorResponse) {
    // console.log('EN ERROR HANDLER');
    this.gridApiRecordCharges.hideOverlay();
    this.isLoading = false;
  }
}