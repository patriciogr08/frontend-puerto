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
import { MaintainersService } from '../../maintainers.service';
import { ModalAddUserComponent } from '../../users/modals/modal-add-user/modal-add-user.component';

@Component({
  selector: 'admin-params-parents',
  templateUrl: './params-parents.component.html',
  styleUrls: ['./params-parents.component.scss']
})
export class ParamsParentsComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public searchInputControl: FormControl;

  //ARRAYS
  public paramsParents: Array<any> = [];

  //FORMS

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public paramsParentsCols: Array<ColDef> = []
  public gridApiParamsParents!: GridApi;
  public gridColumnApiParamsParents!: ColumnApi;

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
        this.gridApiParamsParents.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }

    this.paramsParentsCols = [
      { field: 'id', hide: true },
      { field: 'nombre' },
      { field: 'codigo', headerName: 'Código'},
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
    this.pagination ? null : this.getParamsParents();
  }

  getParamsParents() {
    this.isLoading = true;
    this.gridApiParamsParents !== undefined ? this.gridApiParamsParents.showLoadingOverlay() : null;
    this.restangular.one('parametros').all('lista').customGET('obtenerPadres').subscribe((data) => {
      this.gridApiParamsParents.hideOverlay();
      this.isLoading = false;
      this.paramsParents = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getParamsParentsPaginate() {
    // this.dataSource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.isLoading = true;
    //     this.gridApiParamsParents !== undefined ? this.gridApiParamsParents.showLoadingOverlay() : null;
    //     const page = params.endRow / this.paginationPageSize;
    //     this.maintainersService.getParamsParents(this.pagination, this.paginationPageSize, page).subscribe((data) => {
    //       params.successCallback(data.data.data, data.data.total)
    //       this.gridApiParamsParents.hideOverlay();
    //       this.isLoading = false;
    //     })
    //   }
    // }
    // this.gridApiParamsParents.setDatasource(this.dataSource);
  }

  openDialogUser() {
    const dialogRef = this.dialog.open(ModalAddUserComponent, {
      minWidth: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiParamsParents.applyTransaction({
          add: [res],
          // addIndex: 0
        });
      }
    });
  }

  onGridReadyParamsParents(params: GridReadyEvent) {
    this.gridApiParamsParents = params.api;
    this.gridColumnApiParamsParents = params.columnApi;
    this.pagination ? this.getParamsParentsPaginate() : null;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiParamsParents.hideOverlay();
    this.isLoading = false;
  }
}
