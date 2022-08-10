import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'admin-modal-add-param-child',
  templateUrl: './modal-add-param-child.component.html',
  styleUrls: ['./modal-add-param-child.component.scss']
})
export class ModalAddParamChildComponent implements OnInit {
  //VARIABLES
  public paramChildForm: FormGroup;
  public isLoading: boolean = false;
  public paramChildApi: any;
  public createParamChildApi: any;
  public editParamChildApi: any;

  constructor(
    @Inject(Restangular) public restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddParamChildComponent>,
    public fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.paramChildForm = this.createForm(this.data.paramChild);
    this.createParamChildApi = this.restangular.all('parametros').all('crear').all('Hijo');
    this.editParamChildApi = this.restangular.one('parametros', this.data.paramChild.id);
    this.paramChildApi = this.restangular[this.data.paramsChild === null ? 'all' : 'one']('parametros', this.data.paramsChild === null ? null : this.data.id); //ALL para POST y ONE para PUT
  }

  createForm(paramChild) {
    return this.fb.group({
      id: [paramChild ? paramChild.id : null],
      idPadre: [this.data.paramParent ? this.data.paramParent.id : null],
      codigo: [paramChild ? paramChild.codigo : null, [Validators.required]],
      nombre: [paramChild ? paramChild.nombre : null, [Validators.required]],
      descripcion: [paramChild ? paramChild.descripcion : null, [Validators.required]],
      valor: [paramChild ? paramChild.valor : null],
      activo: [paramChild ? paramChild.activo : null],
    })
  }

  save() {
    this.isLoading = true;
    this.paramChildForm.disable();
    this[this.data.paramChild === null ? 'createParamChildApi' : 'editParamChildApi'][this.data.paramChild === null ? 'post' : 'customPUT'](this.paramChildForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
      this.paramChildForm.enable();
      this.isLoading = false;
    })
  }
}
