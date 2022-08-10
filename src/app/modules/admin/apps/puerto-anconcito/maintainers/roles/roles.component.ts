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
import { ModalAddRoleComponent } from './modals/modal-add-role/modal-add-role.component';

@Component({
  selector: 'admin-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public searchInputControl: FormControl;
  public context: any;

  //ARRAYS
  public roles: Array<any> = [];

  //FORMS

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public rolesCols: Array<ColDef> = []
  public gridApiRoles!: GridApi;
  public gridColumnApiRoles!: ColumnApi;

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
        this.gridApiRoles.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }
    this.context = {
      componentParent: this
    }

    this.rolesCols = [
      { field: 'id', hide: true },
      { field: 'name' },
      { field: 'description' },
      { field: 'guard_name' },
      { field: 'created_at' },
      // { field: 'updated_at' },
      {
        field: "Actions",
        cellRenderer: 'renderActionButtons',
        cellRendererParams: {
          actions: [
            {
              id: 1,
              name: 'edit',
              icon: 'edit',
              tooltip: 'Editar',
              functionName: 'openDialogRole'
            },
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
    this.pagination ? null : this.getRoles();
  }

  getRoles() {
    this.isLoading = true;
    this.gridApiRoles !== undefined ? this.gridApiRoles.showLoadingOverlay() : null;
    this.restangular.one('').customGET('roles').subscribe((data) => {
      this.gridApiRoles.hideOverlay();
      this.isLoading = false;
      this.roles = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getRolesPaginate() {
    // this.dataSource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.isLoading = true;
    //     this.gridApiRoles !== undefined ? this.gridApiRoles.showLoadingOverlay() : null;
    //     const page = params.endRow / this.paginationPageSize;
    //     this.maintainersService.getRoles(this.pagination, this.paginationPageSize, page).subscribe((data) => {
    //       params.successCallback(data.data.data, data.data.total)
    //       this.gridApiRoles.hideOverlay();
    //       this.isLoading = false;
    //     })
    //   }
    // }
    // this.gridApiRoles.setDatasource(this.dataSource);
  }

  openDialogRole(role: any = null) {
    const dialogRef = this.dialog.open(ModalAddRoleComponent, {
      data: role,
      minWidth: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getRoles();
        // this.gridApiRoles.applyTransaction({
        //   add: [res],
        //   // addIndex: 0
        // });
      }
    });
  }

  delete(role: any) {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restangular.one('roles', role.id).remove().subscribe((res: IResponsePA) => {
          if (res.success) {
            this.modalAlertService.open('success', res.success.content);
            this.getRoles();
            this.isLoading = false;
          }
        }, (err) => {
          this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
          this.isLoading = false;
        })
      }
    });
  }

  onGridReadyRoles(params: GridReadyEvent) {
    this.gridApiRoles = params.api;
    this.gridColumnApiRoles = params.columnApi;
    this.pagination ? this.getRolesPaginate() : null;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiRoles.hideOverlay();
    this.isLoading = false;
  }
}
