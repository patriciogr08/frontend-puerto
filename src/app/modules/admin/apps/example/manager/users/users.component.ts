import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { RenderActionButtonsComponent } from 'app/shared/components/render-action-buttons/render-action-buttons.component';
import { Restangular } from 'ngx-restangular';
import { ReplaySubject } from 'rxjs';
import { ManagerService } from '../manager.service';
import { ModalAddUserComponent } from './modals/modal-add-user/modal-add-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public context: any;

  //ARRAYS
  public users: Array<any> = [];

  //FORMS

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public usersCols: Array<ColDef> = []
  public gridApiUsers!: GridApi;
  public gridColumnApiUsers!: ColumnApi;

  constructor(
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
      {
        field: 'code',
        width: 70,
        suppressSizeToFit: true,
      },
      { field: 'name' },
      { field: 'created_at' },
      { field: 'updated_at' },
      {
        field: "Actions",
        cellRenderer: 'renderActionButtons',
        cellRendererParams: {
          actions: [
            {
              id: 1,
              name: 'edit',
              icon: 'edit',
              tooltip: 'Edit'
            },
            {
              id: 1,
              name: 'delete',
              icon: 'delete',
              tooltip: 'Delete'
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
    this.managerService.getUsersMock().subscribe((data) => {
      this.gridApiUsers.hideOverlay();
      this.isLoading = false;
      this.users = data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getUsersRestangular() {
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

  }

  openDialogUser(user: any = null) {
    const dialogRef = this.dialog.open(ModalAddUserComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiUsers.applyTransaction({
          add: [res.row],
          // addIndex: 0
        });
      }
    });
  }

  deleteUser() {
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

  onGridReadyUsers(params: GridReadyEvent) {
    // console.log('EN GRID READY', params.api);
    this.gridApiUsers = params.api;
    this.gridColumnApiUsers = params.columnApi;
    this.pagination ? this.getUsersPaginate() : this.getUsers();
  }

  errHandler(err: HttpErrorResponse) {
    // console.log('EN ERROR HANDLER');
    this.gridApiUsers.hideOverlay();
    this.isLoading = false;
  }
}
