import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
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
  public searchInputControl: FormControl;

  public defaultColDef: ColDef;
  public renderComponents: any;

  public users: Array<any> = [];
  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

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
      // 'renderActionButtons': ActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiUsers.sizeColumnsToFit();
      },
      ...gridOptions()
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
      }
    ];

    this.fuseConfigService.config$.subscribe((data) => {
      data.scheme === 'dark' ? this.gridTheme = 'ag-theme-alpine-dark' : this.gridTheme = 'ag-theme-alpine'
    })
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.gridApiUsers !== undefined ? this.gridApiUsers.showLoadingOverlay() : null;
    this.managerService.getUsers().subscribe((data) => {
      this.gridApiUsers.hideOverlay();
      this.isLoading = false;
      this.users = data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  openDialogUser() {
    const dialogRef = this.dialog.open(ModalAddUserComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridApiUsers.applyTransaction({
          add: [res.row],
          // addIndex: 0
        });
      }
    });
  }

  onGridReadyUsers(params: GridReadyEvent) {
    this.gridApiUsers = params.api;
    this.gridColumnApiUsers = params.columnApi;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiUsers.hideOverlay();
    this.isLoading = false;
  }
}
