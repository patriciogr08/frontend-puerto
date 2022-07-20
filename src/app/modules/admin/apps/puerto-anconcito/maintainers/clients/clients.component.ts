import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, GridApi, ColumnApi, GridReadyEvent, IGetRowsParams, IDatasource } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
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
  public searchInputControl: FormControl;

  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;

  public defaultColDef: ColDef;
  public renderComponents: any;

  public clients: Array<any> = [];
  public clientCtrl: FormControl = new FormControl();
  public clientFilterCtrl: FormControl = new FormControl();
  public filteredClients: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

  public clientsCols: Array<ColDef> = []
  public gridApiClients!: GridApi;
  public gridColumnApiClients!: ColumnApi;

  constructor(
    public dialog: MatDialog,
    public maintainersService: MaintainersService,
    private fuseConfigService: FuseConfigService,
    public fuseAlertService: FuseAlertService,
    public fuseConfirmationService: FuseConfirmationService,
    @Inject(Restangular) public restangular,
  ) {
    this.defaultColDef = defaultColDef
    this.renderComponents = {
      // 'renderActionButtons': ActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiClients.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }

    this.clientsCols = [
      { field: 'id', hide: true },
      { field: 'nombres' },
      { field: 'apellidos' },
      { field: 'identificacion' },
      { field: 'created_at' },
      { field: 'updated_at' },
      // {
      //   field: "Actions",
      //   cellRenderer: 'renderActionButtons',
      // }
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

  openDialogClient() {
    const dialogRef = this.dialog.open(ModalAddClientComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiClients.applyTransaction({
          add: [res],
          // addIndex: 0
        });
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
