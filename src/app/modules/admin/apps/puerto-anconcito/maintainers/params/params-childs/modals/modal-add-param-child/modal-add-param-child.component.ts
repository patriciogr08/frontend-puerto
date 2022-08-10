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
  public minLengtIdentification: number = 10

  constructor(
    @Inject(Restangular) public restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddParamChildComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.paramChildForm = this.createForm(this.data);
    this.paramChildApi = this.restangular[this.data === null ? 'all' : 'one']('parametros', this.data === null ? null : this.data.id); //ALL para POST y ONE para PUT
  }

  createForm(paramChild) {
    return this.fb.group({
      id: [paramChild ? paramChild.id : null],
      codigo: [paramChild ? paramChild.codigo : null, [Validators.required]],
      nombre: [paramChild ? paramChild.nombre : null, [Validators.required]],
      valor: [paramChild ? paramChild.valor : null, [Validators.required]],
      activo: [paramChild ? paramChild.activo : null, [Validators.required]],
    })
  }

  save() {
    this.isLoading = true;
    this.paramChildForm.disable();
    this.paramChildApi[this.data === null ? 'post' : 'customPUT'](this.paramChildForm.value).subscribe((res: IResponsePA) => {
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
