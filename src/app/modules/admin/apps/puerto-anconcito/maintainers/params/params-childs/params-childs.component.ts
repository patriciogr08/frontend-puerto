import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaintainersService } from '../../maintainers.service';
import { ModalAddUserComponent } from '../../users/modals/modal-add-user/modal-add-user.component';
import { ModalAddParamChildComponent } from './modals/modal-add-param-child/modal-add-param-child.component';

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
  public context: any;
  public paramParent: any;

  //ARRAYS
  public paramsParents: Array<any> = [];
  public paramsChilds: Array<any> = [];

  //FORMS
  public paramsParentSelectedForm: FormGroup;

  //GRID
  public defaultColDef: ColDef;
  public renderComponents: any;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public paramsChildsCols: Array<ColDef> = []
  public gridApiParamsChilds!: GridApi;
  public gridColumnApiParamsChilds!: ColumnApi;

  public _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public maintainersService: MaintainersService,
    private fuseConfigService: FuseConfigService,
    public fuseAlertService: FuseAlertService,
    public modalAlertService: ModalAlertService,
    public fuseConfirmationService: FuseConfirmationService,
    @Inject(Restangular) public restangular,
  ) {
    this.defaultColDef = defaultColDef
    this.renderComponents = {
      'renderActionButtons': RenderActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiParamsChilds.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }
    this.context = {
      componentParent: this
    }

    this.paramsChildsCols = [
      { field: 'id', hide: true },
      { field: 'nombre' },
      { field: 'codigo' },
      { field: 'valor' },
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
              functionName: 'openDialogParamsChild'
            },
            {
              id: 1,
              name: 'delete',
              icon: 'delete',
              tooltip: 'Eliminar'
            }
          ]
        }
      },
    ];

    this.fuseConfigService.config$.subscribe((data) => {
      data.scheme === 'dark' ? this.gridTheme = 'ag-theme-alpine-dark' : this.gridTheme = 'ag-theme-alpine'
    })
  }

  ngOnInit(): void {
    // this.pagination ? null : this.getParamsChilds();
    this.paramsParentSelectedForm = this.createParamsParentSelectedForm();
    this.onSelectChange();
  }

  createParamsParentSelectedForm() {
    return this.fb.group({
      paramsParent: [null, Validators.required]
    })
  }

  getParamsParents() {
    this.isLoading = true;
    this.restangular.one('parametros').all('lista').customGET('obtenerPadres').subscribe((data) => {
      this.isLoading = false;
      this.paramsParents = data.data;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getParamsChilds(paramsParent: any) {
    this.isLoading = true;
    this.gridApiParamsChilds !== undefined ? this.gridApiParamsChilds.showLoadingOverlay() : null;
    this.restangular.one('parametros').all('obtenerLista').customGET(paramsParent.codigo).subscribe((data) => {
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

  openDialogParamsChild(paramChild: any = null) {
    const dialogRef = this.dialog.open(ModalAddParamChildComponent, {
      data: {
        paramParent: this.paramParent,
        paramChild
      },
      minWidth: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getParamsChilds(this.paramsParentSelectedForm.get('paramsParent').value);
      }
    });
  }

  delete(paramChild: any) {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restangular.one('parametros', paramChild.id).remove().subscribe((res: IResponsePA) => {
          if (res.success) {
            this.modalAlertService.open('success', res.success.content);
            this.getParamsChilds(this.paramsParentSelectedForm.get('paramsParent').value);
            this.isLoading = false;
          }
        }, (err) => {
          this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
          this.isLoading = false;
        })
      }
    });
  }

  onSelectChange() {
    this.paramsParentSelectedForm.get('paramsParent').valueChanges.pipe((takeUntil(this._unsubscribeAll))).subscribe((data) => {
      this.paramParent = data;
      this.getParamsChilds(data)
    })
  }

  onGridReadyParamsChilds(params: GridReadyEvent) {
    this.gridApiParamsChilds = params.api;
    this.gridColumnApiParamsChilds = params.columnApi;
    this.pagination ? this.getParamsChildsPaginate() : this.getParamsParents();
  }

  errHandler(err: HttpErrorResponse) {
    this.gridApiParamsChilds.hideOverlay();
    this.isLoading = false;
  }
}
