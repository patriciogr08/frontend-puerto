import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'admin-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public context: any;
  public actions: Array<IAction> = [];
  public totalValue: Number = 0;

  //ARRAYS
  public charges: Array<any> = [];

  //FORMS
  public dateRangeForm: FormGroup;

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public chargesCols: Array<ColDef> = []
  public gridApicharges!: GridApi;
  public gridColumnApicharges!: ColumnApi;

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
        this.gridApicharges.sizeColumnsToFit();
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


    this.chargesCols = [
      { field: 'id', hide: true },
      { field: 'usuario.usuario', headerName: 'Usuario' },
      { field: 'fechaInicio' },
      { field: 'fechaFin' },
      { field: 'valorRecaudado' }
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

  getCharges() {
    this.isLoading = true;
    this.gridApicharges !== undefined ? this.gridApicharges.showLoadingOverlay() : null;
    this.restangular.one('historialCobroGarita').all('cobrosCerrados').customPOST(this.dateRangeForm.value).subscribe((data) => {
      this.gridApicharges.hideOverlay();
      this.isLoading = false;
      this.charges = data.data.cobros;
      this.totalValue = data.data.total;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getChargesRestangular() {
    this.isLoading = true;
    this.gridApicharges !== undefined ? this.gridApicharges.showLoadingOverlay() : null;
    this.restangular.all('').customGET('charges').subscribe((data) => {
      this.gridApicharges.hideOverlay();
      this.isLoading = false;
      this.charges = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getChargesPaginate() {

  }

  downloadPDF() {
    let body: Array<Array<any>> = [[
      { text: 'Usuario', style: 'tableHeader' },
      { text: 'Fecha Inicio', style: 'tableHeader' },
      { text: 'Fecha Fin', style: 'tableHeader' },
      { text: 'Valor Recaudado', style: 'tableHeader' }]];
    let item: Array<any> = [];
    for (let index = 0; index < this.charges.length; index++) {
      const charge = this.charges[index];
      item = [];
      item.push(charge.usuario.usuario, charge.fechaInicio, charge.fechaFin, charge.valorRecaudado);
      body.push(item);
    }
    let dd = {
      content: [
        { text: 'Cobros', style: 'title' },
        {
          style: 'horizontalTable',
          table: {
            widths: ['*', '*', '*', '*'],
            body: body
          }
        },
        { text: 'Valor Total: ' + this.totalValue, style: 'footer' },
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        horizontalTable: {
          margin: [0, 5, 0, 10]
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

  openDialogCharge(charge: any = null) {
    // const dialogRef = this.dialog.open(ModalAddChargeComponent, {
    //   data: charge
    // });

    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.gridApicharges.applyTransaction({
    //       add: [res.row],
    //       // addIndex: 0
    //     });
    //   }
    // });
  }

  deleteCharge() {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //Llamada a API para eliminar
      }
    });
  }

  onGridReadyCharges(params: GridReadyEvent) {
    // console.log('EN GRID READY', params.api);
    this.gridApicharges = params.api;
    this.gridColumnApicharges = params.columnApi;
    // this.pagination ? this.getChargesPaginate() : this.getCharges();
  }

  errHandler(err: HttpErrorResponse) {
    // console.log('EN ERROR HANDLER');
    this.gridApicharges.hideOverlay();
    this.isLoading = false;
  }
}
