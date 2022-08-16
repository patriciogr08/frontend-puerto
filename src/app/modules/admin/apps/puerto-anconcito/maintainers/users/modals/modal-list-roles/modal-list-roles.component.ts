import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, ColDef, IDatasource, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { RenderActionButtonsComponent } from 'app/shared/components/render-action-buttons/render-action-buttons.component';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'admin-modal-list-roles',
  templateUrl: './modal-list-roles.component.html',
  styleUrls: ['./modal-list-roles.component.scss']
})
export class ModalListRolesComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public searchInputControl: FormControl;
  public context: any;

  //ARRAYS
  public roles: Array<any> = [];
  public userRoles: Array<any> = [];

  //FORMS
  public roleSelectedForm: FormGroup;

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public userRolesCols: Array<ColDef> = []
  public gridApiUserRoles!: GridApi;
  public gridColumnApiUserRoles!: ColumnApi;


  constructor(
    @Inject(Restangular) public restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    private fuseConfigService: FuseConfigService,
    public fuseConfirmationService: FuseConfirmationService,
    public dialogRef: MatDialogRef<ModalListRolesComponent>,
    public fb: FormBuilder
  ) {
    this.defaultColDef = defaultColDef
    this.renderComponents = {
      'renderActionButtons': RenderActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiUserRoles.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }
    this.context = {
      componentParent: this
    }

    this.userRolesCols = [
      { field: 'id', hide: true },
      { field: 'name' },
      { field: 'description' },
      { field: 'guard_name' },
      { field: 'created_at' },
      { field: 'updated_at' },
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
    this.userRoles = this.data.roles;
    this.roleSelectedForm = this.createRoleSelectedForm();
    this.getRoles();
  }

  createRoleSelectedForm() {
    return this.fb.group({
      role: [null, Validators.required]
    })
  }

  getRoles() {
    this.isLoading = true;
    this.restangular.one('').customGET('roles').subscribe((data) => {
      this.isLoading = false;
      this.roles = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  /**
   * Se necesita api para traer roles por usuario
   */
  getUserRoles() {
    this.isLoading = true;
    this.gridApiUserRoles !== undefined ? this.gridApiUserRoles.showLoadingOverlay() : null;
    this.restangular.all('roles').customGET(1).subscribe((data) => {
      this.gridApiUserRoles.hideOverlay();
      this.isLoading = false;
      this.userRoles = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getUserRolesPaginate() {

  }

  save() {
    this.isLoading = true;
    this.roleSelectedForm.disable();
    this.restangular.all('users').one('asignarRol', this.data.id).customPUT(this.roleSelectedForm.value.role).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.userRoles = res.data.roles;
        this.roleSelectedForm.enable();
        this.isLoading = false;
        
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
      this.roleSelectedForm.enable();
      this.isLoading = false;
    })
  }

  delete(userRole: any) {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restangular.all('users').one('removerRol', this.data.id).customPUT(userRole).subscribe((res: IResponsePA) => {
          if (res.success) {
            this.modalAlertService.open('success', res.success.content);
            this.userRoles = res.data.roles;
            this.isLoading = false;
          }
        }, (err) => {
          this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
          this.isLoading = false;
        })
      }
    });
  }

  onGridReadyUserRoles(params: GridReadyEvent) {
    this.gridApiUserRoles = params.api;
    this.gridColumnApiUserRoles = params.columnApi;
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiUserRoles.hideOverlay();
    this.isLoading = false;
  }
}
