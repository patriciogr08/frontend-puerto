import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IResponse, IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'app-modal-add-client',
  templateUrl: './modal-add-client.component.html',
  styleUrls: ['./modal-add-client.component.scss']
})
export class ModalAddClientComponent implements OnInit {
  //VARIABLES
  public clientForm: FormGroup;
  public isLoading: boolean = false;
  public isEdit: boolean = false;
  public minLengtIdentification: number = 10
  public clientApi: Restangular;

  constructor(
    @Inject(Restangular) public restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddClientComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = this.data ? true : false;
    this.clientForm = this.createForm(this.data);
    this.clientApi = this.restangular[this.isEdit ? 'one' : 'all']('clientes', this.isEdit ? this.data.id : null); //ONE para PUT y ALL para POST
  }

  createForm(client) {
    return this.fb.group({
      id: [client ? client.id : null],
      idTipoIdentificacion: [5],
      nombres: [client ? client.nombres : null, [Validators.required]],
      apellidos: [client ? client.apellidos : null, [Validators.required]],
      identificacion: [client ? client.identificacion : null, [Validators.required, Validators.minLength(this.minLengtIdentification)]]
    })
  }

  save() {
    this.isLoading = true;
    this.clientForm.disable();
    this.clientApi[this.isEdit ? 'customPUT' : 'post'](this.clientForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    }, (err) => {
      console.log(err);
      this.modalAlertService.open('error', err.error.error.content);
      this.clientForm.enable();
      this.isLoading = false;
    })
  }
}
