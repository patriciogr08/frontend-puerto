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
  selector: 'admin-params-childs',
  templateUrl: './params-childs.component.html',
  styleUrls: ['./params-childs.component.scss']
})
export class ParamsChildsComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public searchInputControl: FormControl;

  //ARRAYS
  public paramsChilds: Array<any> = [];

  //FORMS

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public paramsChildsCols: Array<ColDef> = []
  public gridApiParamsChilds!: GridApi;
  public gridColumnApiParamsChilds!: ColumnApi;

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
        this.gridApiParamsChilds.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }

    this.paramsChildsCols = [
      { field: 'id', hide: true },
      { field: 'nombre' },
      { field: 'codigo' },
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
    this.pagination ? null : this.getParamsChilds();
  }

  getParamsChilds() {
    this.isLoading = true;
    this.gridApiParamsChilds !== undefined ? this.gridApiParamsChilds.showLoadingOverlay() : null;
    this.restangular.one('parametros').all('lista').customGET('obtenerHijos').subscribe((data) => {
      this.gridApiParamsChilds.hideOverlay();
      this.isLoading = false;
      this.paramsChilds = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getParamsChildsPaginate() {
    // this.dataSource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.isLoading = true;
    //     this.gridApiParamsChilds !== undefined ? this.gridApiParamsChilds.showLoadingOverlay() : null;
    //     const page = params.endRow / this.paginationPageSize;
    //     this.maintainersService.getParamsChilds(this.pagination, this.paginationPageSize, page).subscribe((data) => {
    //       params.successCallback(data.data.data, data.data.total)
    //       this.gridApiParamsChilds.hideOverlay();
    //       this.isLoading = false;
    //     })
    //   }
    // }
    // this.gridApiParamsChilds.setDatasource(this.dataSource);
  }

  openDialogUser() {
    const dialogRef = this.dialog.open(ModalAddUserComponent, {
      minWidth: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiParamsChilds.applyTransaction({
          add: [res],
          // addIndex: 0
        });
      }
    });
  }

  onGridReadyParamsChilds(params: GridReadyEvent) {
    this.gridApiParamsChilds = params.api;
    this.gridColumnApiParamsChilds = params.columnApi;
    this.pagination ? this.getParamsChildsPaginate() : null;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiParamsChilds.hideOverlay();
    this.isLoading = false;
  }
}
