import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridOptions, IDatasource, ColDef, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { AuthService } from 'app/core/auth/auth.service';
import { defaultColDef, gridOptions } from 'app/core/config/grid.config';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';
import { MaintainersService } from '../../maintainers/maintainers.service';
import { ModalCloseTurnComponent } from './modals/modal-close-turn/modal-close-turn.component';

@Component({
  selector: 'app-close-turns',
  templateUrl: './close-turns.component.html',
  styleUrls: ['./close-turns.component.scss']
})
export class CloseTurnsComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public gridOptions: GridOptions;
  public isLoading: boolean = false;
  public isPanelOpen: boolean = true;
  public totalRecaudado: number = 0;
  public user: any = {};

  //ARRAYS
  public values: Array<any> = [];

  //FORMS
  public userForm: FormGroup;

  //GRID
  public defaultColDef: ColDef;
  public valuesCols: Array<ColDef> = [];
  public gridApiValues!: GridApi;
  public gridColumnApiValues!: ColumnApi;
  public pagination: boolean = false;
  public paginationPageSize: number = 1;
  public dataSource: IDatasource;
  public renderComponents: any;

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public authService: AuthService,
    public maintainersService: MaintainersService,
    private fuseConfigService: FuseConfigService,
    public fuseAlertService: FuseAlertService,
    public modalAlertService: ModalAlertService,
    public fuseConfirmationService: FuseConfirmationService,
    @Inject(Restangular) public restangular,
  ) {
    this.defaultColDef = defaultColDef
    this.renderComponents = {
      // 'renderActionButtons': ActionButtonsComponent
    };
    this.gridOptions = {
      onGridSizeChanged: _onGridSizeChanged => {
        this.gridApiValues.sizeColumnsToFit();
      },
      rowModelType: this.pagination ? 'infinite' : null,
      cacheBlockSize: this.pagination ? this.paginationPageSize : null,
      ...gridOptions()
    }

    this.valuesCols = [
      { field: 'id', hide: true },
      { field: 'codigo', hide: true },
      { field: 'nombre' },
      {
        field: 'valor',
        aggFunc: "sum",
        editable: true,
        valueParser: "Number(newValue)"
      },
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
    this.user = this.authService.user;
    this.pagination ? null : this.getValues();
    this.userForm = this.createUserForm(this.user);
  }

  createUserForm(user) {
    return this.fb.group({
      id: [user.id],
      nombre: [user.primerNombre],
      apellido: [user.primerApellido],
      usuario: [user.usuario]
    })
  }

  getValues() {
    this.isLoading = true;
    this.gridApiValues !== undefined ? this.gridApiValues.showLoadingOverlay() : null;
    const params = { idUsuarioCreacion: this.user.id }
    this.restangular.one('historialCobroGarita').all('valoresTurno').customPOST(params).subscribe((data) => {
      this.gridApiValues.hideOverlay();
      this.isLoading = false;
      this.totalRecaudado = data.data.totalRecaudado;
      this.values = data.data.valorRecaudidado;
    }, (err: HttpErrorResponse) => {
      this.errHandler(err);
    });
  }

  getValuesPaginate() {
    // this.dataSource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.isLoading = true;
    //     this.gridApiClients !== undefined ? this.gridApiClients.showLoadingOverlay() : null;
    //     const page = params.endRow / this.paginationPageSize;
    //     this.maintainersService.getClients(this.pagination, this.paginationPageSize, page).subscribe((data) => {
    //       params.successCallback(data.data.data, data.data.total)
    //       this.gridApiClients.hideOverlay();
    //       this.isLoading = false;
    //     })
    //   }
    // }
    // this.gridApiClients.setDatasource(this.dataSource);
  }

  sendEmail(data) {
    const params = {
      "asunto": "Cierre de turno.",
      "remitente": {
        "name": "Puerto Anconcito",
        "email": "cindy.suarezricardo@upse.edu.ec"
      },
      "responderA": {
        "name": "Puerto Anconcito",
        "email": "cindy.suarezricardo@upse.edu.ec"
      },
      "para": [
        {
          "name": "Alex",
          "email": "aprg0808@gmail.com"
        }
      ],
      "cc": [
        {
          "name": "Supervisor",
          "email": "cindy.pris2124@gmail.com"
        }
      ],
      "templateId": 2,
      "params": {
        "titulo": "Cierre turno de cobros de garita",
        "usuario": this.user.primerNombre + ' ' + this.user.primerApellido,
        "fechaInicio": data.fechaInicio,
        "fechaFin": data.fechaFin,
        "valorRecaudado": data.valorRecaudado,
        "observacionCierre": data.observacionCierre,
        "nota": "Agradecemos la atención prestada a esta notificación"
      }
    }
    this.restangular.one('correo').all('sendinblue').post(params).subscribe((res: IResponsePA) => {
      if (res) {
        this.modalAlertService.open('success', res.success.content);
      }
    })
  }

  openDialogCloseTurn() {
    const dialogRef = this.dialog.open(ModalCloseTurnComponent);

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.values = [];
        this.userForm.reset();
        this.totalRecaudado = 0;
        this.sendEmail(res.data);
      }
    })
  }

  onGridReadyValues(params: GridReadyEvent) {
    this.gridApiValues = params.api;
    this.gridColumnApiValues = params.columnApi;
    this.pagination ? this.getValuesPaginate() : null;
  }

  errHandler(err: HttpErrorResponse) {
    const message: string = 'Error en la consulta, vuelva a intentar!'
    this.modalAlertService.open('error', err.error.error ? err.error.error.content.error[0] : message);
    this.gridApiValues.hideOverlay();
    this.isLoading = false;
  }
}
