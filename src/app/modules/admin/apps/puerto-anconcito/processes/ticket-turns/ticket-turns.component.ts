import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfigService } from '@fuse/services/config';
import { ColDef, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { AuthService } from 'app/core/auth/auth.service';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import moment from 'moment';
import { NgxPrinterService } from 'ngx-printer';
import { Restangular } from 'ngx-restangular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ManagerService } from '../../../example/manager/manager.service';
import { ModalAddClientComponent } from '../../maintainers/clients/modals/modal-add-client/modal-add-client.component';

@Component({
  selector: 'app-ticket-turns',
  templateUrl: './ticket-turns.component.html',
  styleUrls: ['./ticket-turns.component.scss']
})
export class TicketTurnsComponent implements OnInit {
  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public isLoading: boolean = false;
  public isPanelOpen: boolean = true;
  public user: any;
  public typeVehicle: any = false;
  public curentDate = moment();
  public ticketNumber: string = '';

  //ARRAYS
  public turnsCols: Array<ColDef> = [];
  public clients: Array<any> = [];
  public typeVehicles: Array<any> = [];

  //FORMS
  public clientForm: FormGroup;
  public clientSelectedForm: FormGroup;
  public turnForm: FormGroup;

  //GRID
  public defaultColDef: ColDef;
  public gridApiTurns!: GridApi;
  public gridColumnApiTurns!: ColumnApi;
  public renderComponents: any;

  public _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public managerService: ManagerService,
    public modalAlertService: ModalAlertService,
    private fuseConfigService: FuseConfigService,
    private printerService: NgxPrinterService,
    public fb: FormBuilder,
    @Inject(Restangular) public restangular,
  ) {
    this.defaultColDef = {
      flex: 1,
      resizable: true,
      editable: false,
    };

    this.renderComponents = {
      // 'renderActionButtons': RenderActionButtonsComponent
    };

    this.turnsCols = [
      { field: 'id', hide: true },
      { field: 'order' },
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
    this.user = this.authService.user;
    this.openTurn();
    this.clientForm = this.createClientForm();
    this.turnForm = this.createTurnForm();
    this.clientSelectedForm = this.createClientSelectedForm();

    this.getClients();
    this.getTypeVehicles();

    //SUBSCRIPTIONS
    this.setValuesToForms();
  }

  createClientSelectedForm() {
    return this.fb.group({
      client: []
    })
  }

  createClientForm() {
    return this.fb.group({
      id: [],
      nombres: [],
      apellidos: [],
      identificacion: []
    })
  }

  createTurnForm() {
    return this.fb.group({
      idCliente: [null, Validators.required],
      idTipoVehiculo: [null, Validators.required],
      placaVehiculo: ['', Validators.required],
      valor: [null, Validators.required]
    })
  }

  getClients() {
    this.restangular.all('').customGET('clientes').subscribe((data) => {
      this.clients = data.data.data;
    }, (err: HttpErrorResponse) => {
      // this.errHandler(err);
    });
  }

  getTypeVehicles() {
    this.restangular.one('parametros').one('obtenerLista').customGET('PAR-TIPO-VEH').subscribe((data) => {
      this.typeVehicles = data.data;
    });
  }

  openTurn() {
    const params = { idUsuarioCreacion: this.user.id };
    this.restangular.one('historialCobroGarita').all('aperturarTurnoCobro').post(params).subscribe((res: any) => {
      if (res.data.fechaFin !== null) {
        this.modalAlertService.open('info', res.success.content);
      }
    })
  }

  setValuesToForms() {
    this.turnForm.get('idTipoVehiculo').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      for (const typeVehicle of this.typeVehicles) {
        if (typeVehicle.id === data) {
          this.typeVehicle = typeVehicle;
          this.turnForm.get('valor').patchValue(typeVehicle.valor);
        }
      }
    })
    this.clientSelectedForm.get('client').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      if (data) {
        this.clientForm.patchValue(data);
        this.turnForm.get('idCliente').setValue(data.id);
      }

    })
  }

  printTicket() {
    this.printerService.printAngular(this.PrintTemplateTpl);
  }

  save() {
    this.restangular.all('cobroGarita').post(this.turnForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content)
        this.ticketNumber = res.data.ticket;
        this.printTicket();
        this.clientSelectedForm.reset();
        this.clientForm.reset();
        this.turnForm.reset();
      }
    })
  }

  openDialogClient() {
    const dialogRef = this.dialog.open(ModalAddClientComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getClients();
      }
    });
  }

  onGridReadyTurns(params: GridReadyEvent) {
    this.gridApiTurns = params.api;
    this.gridColumnApiTurns = params.columnApi;
    this.gridApiTurns.sizeColumnsToFit();
  }
}
