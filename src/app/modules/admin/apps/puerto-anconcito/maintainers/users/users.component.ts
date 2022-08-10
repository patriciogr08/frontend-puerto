import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, IDatasource, ColDef, GridApi, ColumnApi, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { RenderActionButtonsComponent } from 'app/shared/components/render-action-buttons/render-action-buttons.component';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';
import { MaintainersService } from '../maintainers.service';
import { ModalAddUserComponent } from './modals/modal-add-user/modal-add-user.component';
import { ModalListRolesComponent } from './modals/modal-list-roles/modal-list-roles.component';

@Component({
  selector: 'admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public searchInputControl: FormControl;
  public context: any;

  //ARRAYS
  public users: Array<any> = [];

  //FORMS

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public usersCols: Array<ColDef> = []
  public gridApiUsers!: GridApi;
  public gridColumnApiUsers!: ColumnApi;

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
        this.gridApiUsers.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }
    this.context = {
      componentParent: this
    }

    this.usersCols = [
      { field: 'id', hide: true },
      { field: 'primerNombre' },
      { field: 'segundoNombre' },
      { field: 'primerApellido' },
      { field: 'segundoApellido' },
      { field: 'usuario' },
      { field: 'email' },
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
              functionName: 'openDialogUser'
            },
            {
              id: 2,
              name: 'delete',
              icon: 'delete',
              tooltip: 'Eliminar'
            },
            {
              id: 3,
              name: 'role',
              icon: 'remove_red_eye',
              tooltip: 'Roles',
              functionName: 'openDialogListRoles'
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
  }

  getUsers() {
    this.isLoading = true;
    this.gridApiUsers !== undefined ? this.gridApiUsers.showLoadingOverlay() : null;
    this.restangular.all('').customGET('users').subscribe((data) => {
      this.gridApiUsers.hideOverlay();
      this.isLoading = false;
      this.users = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getUsersPaginate() {
    // this.dataSource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.isLoading = true;
    //     this.gridApiUsers !== undefined ? this.gridApiUsers.showLoadingOverlay() : null;
    //     const page = params.endRow / this.paginationPageSize;
    //     this.maintainersService.getUsers(this.pagination, this.paginationPageSize, page).subscribe((data) => {
    //       params.successCallback(data.data.data, data.data.total)
    //       this.gridApiUsers.hideOverlay();
    //       this.isLoading = false;
    //     })
    //   }
    // }
    // this.gridApiUsers.setDatasource(this.dataSource);
  }

  openDialogUser(user: any = null) {
    const dialogRef = this.dialog.open(ModalAddUserComponent, {
      data: user,
      minWidth: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiUsers.applyTransaction({
          add: [res],
          // addIndex: 0
        });
      }
    });
  }

  openDialogListRoles(user: any = null) {
    const dialogRef = this.dialog.open(ModalListRolesComponent, {
      data: user,
      width: '70vw',
      // minHeight: '500px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.gridApiUsers.applyTransaction({
        //   add: [res],
        //   // addIndex: 0
        // });
      }
    });
  }

  delete(user: any) {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restangular.one('users', user.id).remove().subscribe((res: IResponsePA) => {
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

  onGridReadyUsers(params: GridReadyEvent) {
    this.gridApiUsers = params.api;
    this.gridColumnApiUsers = params.columnApi;
    this.pagination ? this.getUsersPaginate() : this.getUsers();

  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiUsers.hideOverlay();
    this.isLoading = false;
  }
}
