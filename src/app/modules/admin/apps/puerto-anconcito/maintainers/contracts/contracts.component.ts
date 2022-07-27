import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, IDatasource, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { Restangular } from 'ngx-restangular';
import { MaintainersService } from '../maintainers.service';
import { ModalAddContractComponent } from './modals/modal-add-contract/modal-add-contract.component';
import { RenderActionButtonsComponent } from './renders/render-action-buttons/render-action-buttons.component';

@Component({
  selector: 'admin-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public searchInputControl: FormControl;

  //ARRAYS
  public contracts: Array<any> = [];

  //FORMS

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public contractsCols: Array<ColDef> = []
  public gridApiContracts!: GridApi;
  public gridColumnApiContracts!: ColumnApi;

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
      'renderActionButtons': RenderActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiContracts.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }

    this.contractsCols = [
      { field: 'id', hide: true },
      { field: 'empleado.primerNombre', headerName: 'Nombre' },
      { field: 'empleado.primerApellido', headerName: 'Apellido' },
      { field: 'mesesContrato' },
      { field: 'fechaInicio' },
      { field: 'fechaFin' },
      { field: 'created_at' },
      // { field: 'updated_at' },
      {
        field: "Actions",
        cellRenderer: 'renderActionButtons',
      }
    ];

    this.fuseConfigService.config$.subscribe((data) => {
      data.scheme === 'dark' ? this.gridTheme = 'ag-theme-alpine-dark' : this.gridTheme = 'ag-theme-alpine'
    })
  }

  ngOnInit(): void {
    this.pagination ? null : this.getContracts();
  }

  getContracts() {
    this.isLoading = true;
    this.gridApiContracts !== undefined ? this.gridApiContracts.showLoadingOverlay() : null;
    this.restangular.all('').customGET('controlEmpleados').subscribe((data) => {
      this.gridApiContracts.hideOverlay();
      this.isLoading = false;
      this.contracts = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getContractsPaginate() {
    // this.dataSource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.isLoading = true;
    //     this.gridApiContracts !== undefined ? this.gridApiContracts.showLoadingOverlay() : null;
    //     const page = params.endRow / this.paginationPageSize;
    //     this.maintainersService.getContracts(this.pagination, this.paginationPageSize, page).subscribe((data) => {
    //       params.successCallback(data.data.data, data.data.total)
    //       this.gridApiContracts.hideOverlay();
    //       this.isLoading = false;
    //     })
    //   }
    // }
    // this.gridApiContracts.setDatasource(this.dataSource);
  }

  openDialogContract() {
    const dialogRef = this.dialog.open(ModalAddContractComponent, {
      disableClose: true,
      minWidth: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiContracts.applyTransaction({
          add: [res],
          // addIndex: 0
        });
      }
    });
  }

  onGridReadyContracts(params: GridReadyEvent) {
    this.gridApiContracts = params.api;
    this.gridColumnApiContracts = params.columnApi;
    this.pagination ? this.getContractsPaginate() : null;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiContracts.hideOverlay();
    this.isLoading = false;
  }
}
