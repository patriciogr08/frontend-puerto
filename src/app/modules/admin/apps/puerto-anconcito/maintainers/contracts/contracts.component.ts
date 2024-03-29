import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, IDatasource, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { RenderActionButtonsComponent } from 'app/shared/components/render-action-buttons/render-action-buttons.component';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';
import { MaintainersService } from '../maintainers.service';
import { ModalAddContractComponent } from './modals/modal-add-contract/modal-add-contract.component';

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
  public context: any;

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
    public modalAlertService: ModalAlertService,
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
    this.context = {
      componentParent: this
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
        cellRendererParams: {
          actions: [
            {
              id: 1,
              name: 'delete',
              icon: 'delete',
              tooltip: 'Eliminar'
            }
          ]
        }
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

  openDialog(contract: any = null) {
    const dialogRef = this.dialog.open(ModalAddContractComponent, {
      data: contract,
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

  delete(contract: any) {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restangular.one('controlEmpleados', contract.id).remove().subscribe((res: IResponsePA) => {
          if (res.success) {
            this.modalAlertService.open('success', res.success.content);
            this.isLoading = false;
          }
        }, (err) => {
          this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
          this.isLoading = false;
        })
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
