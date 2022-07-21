import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfigService } from '@fuse/services/config';
import { ColDef, GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { AuthService } from 'app/core/auth/auth.service';
import { IResponse } from 'app/shared/interfaces/response.interface';
import { Restangular } from 'ngx-restangular';
import { of, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ManagerService } from '../../../example/manager/manager.service';

@Component({
  selector: 'app-ticket-turns',
  templateUrl: './ticket-turns.component.html',
  styleUrls: ['./ticket-turns.component.scss']
})
export class TicketTurnsComponent implements OnInit {
  //VARIABLES
  public gridTheme: string = 'ag-theme-alpine';
  public isLoading: boolean = false;
  public isPanelOpen: boolean = true;
  public searchInputControl: FormControl = new FormControl();

  public user: any;

  public clients: Array<any> = [];
  public clientForm: FormGroup;
  public client: any;
  public clientSelected: FormControl = new FormControl();
  public clientCtrl: FormControl = new FormControl();
  public clientFilterCtrl: FormControl = new FormControl();
  public filteredClient: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

  public turnForm: FormGroup;
  public turn: any;

  public typeVehicles: Array<any> = [];
  public typeVehicleCtrl: FormControl = new FormControl();
  public typeVehicleFilterCtrl: FormControl = new FormControl();
  public filteredTypeVehicle: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

  public defaultColDef: ColDef;

  public turns: Array<any> = [];
  public uploadFileCtrl: FormControl = new FormControl();
  public uploadFileFilterCtrl: FormControl = new FormControl();
  public filteredTurns: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

  public turnsCols: Array<ColDef> = []
  public gridApiTurns!: GridApi;
  public gridColumnApiTurns!: ColumnApi;

  public renderComponents: any;

  public _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public managerService: ManagerService,
    private fuseConfigService: FuseConfigService,
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
    this.clientForm = this.createForm();
    this.turnForm = this.createTurnForm();

    this.getClients();
    this.getTypeVehicles();

    //SUBSCRIPTIONS
    this.setValuesToForms();
  }

  createForm() {
    return this.fb.group({
      id: [],
      nombres: [],
      apellidos: [],
      identificacion: []
    })
  }

  createTurnForm() {
    return this.fb.group({
      idCliente: [],
      idTipoVehiculo: [],
      placaVehiculo: [],
      valor: []
    })
  }

  getTurns(order: any = null) {
    console.log(order);
    this.isLoading = true;
    const params = {
      order: order
    }
    this.gridApiTurns !== undefined ? this.gridApiTurns.showLoadingOverlay() : null;
    this.restangular.all('documents').getList(order !== null ? params : null).subscribe((data) => {
      this.gridApiTurns.hideOverlay();
      this.isLoading = false;
      this.turns = data;
    });
  }

  getClients() {
    this.restangular.all('').customGET('clientes').subscribe((data) => {
      this.clients = data.data.data;
      this.filteredClient.next(this.clients.slice());
      this.searchFieldClientSubscriptions();
    }, (err: HttpErrorResponse) => {
      // this.errHandler(err);
    });
  }

  getTypeVehicles() {
    this.restangular.one('parametros').one('obtenerLista').customGET('PAR-TIPO-VEH').subscribe((data) => {
      // this.gridApiTurns.hideOverlay();
      // this.isLoading = false;
      this.typeVehicles = data.data;
      this.filteredTypeVehicle.next(this.typeVehicles.slice());
      this.searchFieldSubscriptions();
    });
  }

  openTurn() {
    const params = {idUsuarioCreacion: this.user.id};
    this.restangular.one('historialCobroGarita').all('aperturarTurnoCobro').post(params).subscribe((res: any) => {
      if (res.data.fechaFin !== null) {
        console.log('TURNO ABIERTO');
        alert('TURNO ABIERTO');
      }
    })
  }

  setValuesToForms() {
    this.turnForm.get('idTipoVehiculo').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      for (const typeVehicle of this.typeVehicles) {
        if (typeVehicle.id === data) {
          this.turnForm.get('valor').patchValue(typeVehicle.valor);
        }
      }
    })
    this.clientSelected.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.clientForm.patchValue(data);
      this.turnForm.get('idCliente').setValue(data.id);
    })
  }

  save() {
    console.log(this.turnForm.value);
    this.restangular.all('cobroGarita').post(this.turnForm.value).subscribe((res: IResponse) => {
      // this.modalAlertService.openAlert(res.message.type, res.message.body, false);
      if (res) {
        alert('TURNO GUARDADO');
        this.clientForm.reset();
        this.turnForm.reset();
      }
    })
  }

  searchOrder() {
    this.isLoading = true;
    const params = {
      order: this.searchInputControl.value
    }
    this.restangular.all('').customGET('order-dobra', params).subscribe((res) => {
      if (res.data.client) {
        // this.isLoading = false;
        this.client = res.data.client;
        this.clientForm.patchValue({
          order: this.client.OrdenCIA,
          procedure: this.client.Orden,
          client: this.client.client.Nombre,
          request: this.client.NoPedido
        })
        this.isPanelOpen = true;
        this.getTurns(this.client.OrdenCIA);
      } else {
        this.isLoading = false;
      }

    });
  }

  searchFieldSubscriptions() {
    this.typeVehicleCtrl.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.filterClients();
    });
  }

  protected filterClients() {
    if (!this.clients) {
      return;
    }
    // get the search keyword
    let search = this.clientFilterCtrl.value;
    if (!search) {
      this.filteredClient.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredClient.next(
      this.clients.filter(client => client.id.toLowerCase().indexOf(search) > -1)
    );
  }

  searchFieldClientSubscriptions() {
    this.clientCtrl.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.filterTypeVehicles();
    });
  }

  protected filterTypeVehicles() {
    if (!this.typeVehicles) {
      return;
    }
    // get the search keyword
    let search = this.typeVehicleFilterCtrl.value;
    if (!search) {
      this.filteredTypeVehicle.next(this.typeVehicles.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTypeVehicle.next(
      this.typeVehicles.filter(typeVehicle => typeVehicle.id.toLowerCase().indexOf(search) > -1)
    );
  }

  openDialogUploadFile() {
    // const dialogRef = this.dialog.open(ModalUploadFileComponent, {
    //   data: {
    //     client: this.clientForm.value
    //   }
    // });

    // dialogRef.afterClosed().subscribe(res => {
    //   console.log(res);
    //   if (res) {
    //     this.gridApiTurns.applyTransaction({
    //       add: [res.row],
    //       // addIndex: 0
    //     });
    //   }
    // });
  }

  onGridReadyTurns(params: GridReadyEvent) {
    this.gridApiTurns = params.api;
    this.gridColumnApiTurns = params.columnApi;
    this.gridApiTurns.sizeColumnsToFit();
  }
}
