import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, GridApi, ColumnApi, GridReadyEvent, IGetRowsParams, IDatasource } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { RenderActionButtonsComponent } from 'app/shared/components/render-action-buttons/render-action-buttons.component';
import { IAction } from 'app/shared/interfaces/ag-grid.interface';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';
import { ReplaySubject } from 'rxjs';
import { MaintainersService } from '../maintainers.service';
import { ModalAddClientComponent } from './modals/modal-add-client/modal-add-client.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public actions: Array<IAction> = [];
  public context: any;

  //ARRAYS
  public clients: Array<any> = [];

  //FORMS

  //GRID
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public defaultColDef: ColDef;
  public renderComponents: any;
  public clientsCols: Array<ColDef> = []
  public gridApiClients!: GridApi;
  public gridColumnApiClients!: ColumnApi;

  constructor(
    public dialog: MatDialog,
    public maintainersService: MaintainersService,
    private fuseConfigService: FuseConfigService,
    public fuseAlertService: FuseAlertService,
    public modalAlertService: ModalAlertService,
    public fuseConfirmationService: FuseConfirmationService,
    @Inject(Restangular) public restangular,
  ) {
    this.defaultColDef = defaultColDef
    this.renderComponents = {
      'renderActionButtons': RenderActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiClients.sizeColumnsToFit();
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
        tooltip: 'Editar',
        functionName: 'openDialogClient',
        // disableIf: {
        //   param: 'state',
        //   operator: '===',
        //   condition: 1
        // }
      },
      {
        id: 2,
        name: 'delete',
        icon: 'delete',
        tooltip: 'Eliminar',
        functionName: 'deleteClient'
      }
    ]

    this.clientsCols = [
      { field: 'id', hide: true },
      { field: 'nombres' },
      { field: 'apellidos' },
      { field: 'identificacion', headerName: 'Identificación' },
      { field: 'created_at' },
      { field: 'updated_at' },
      {
        field: "Actions",
        cellRenderer: 'renderActionButtons',
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          actions: this.actions
        }
      }
    ];

    this.fuseConfigService.config$.subscribe((data) => {
      data.scheme === 'dark' ? this.gridTheme = 'ag-theme-alpine-dark' : this.gridTheme = 'ag-theme-alpine'
    })
  }

  ngOnInit(): void {
    this.pagination ? null : this.getClients();
  }

  getClients() {
    this.isLoading = true;
    this.gridApiClients !== undefined ? this.gridApiClients.showLoadingOverlay() : null;
    this.restangular.all('').customGET('clientes').subscribe((data) => {
      this.gridApiClients.hideOverlay();
      this.isLoading = false;
      this.clients = data.data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getClientsPaginate() {
    this.dataSource = {
      getRows: (params: IGetRowsParams) => {
        this.isLoading = true;
        this.gridApiClients !== undefined ? this.gridApiClients.showLoadingOverlay() : null;
        const page = params.endRow / this.paginationPageSize;
        this.maintainersService.getClients(this.pagination, this.paginationPageSize, page).subscribe((data) => {
          params.successCallback(data.data.data, data.data.total)
          this.gridApiClients.hideOverlay();
          this.isLoading = false;
        })
      }
    }
    this.gridApiClients.setDatasource(this.dataSource);
  }

  openDialogClient(client: any = null) {
    const dialogRef = this.dialog.open(ModalAddClientComponent, {
      data: client
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getClients();
      }
    });
  }

  deleteClient(client: any) {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restangular.one('clientes', client.id).remove().subscribe((res: IResponsePA) => {
          if (res.success) {
            this.modalAlertService.open('success', res.success.content);
            this.getClients();
          }
        }, (err) => {
          this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
          this.errHandler(err);
        })
      }
    });
  }

  onGridReadyClients(params: GridReadyEvent) {
    this.gridApiClients = params.api;
    this.gridColumnApiClients = params.columnApi;
    this.pagination ? this.getClientsPaginate() : null;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiClients.hideOverlay();
    this.isLoading = false;
  }
}
