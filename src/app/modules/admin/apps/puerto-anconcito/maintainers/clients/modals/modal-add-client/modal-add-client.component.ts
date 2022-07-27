import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  public minLengtIdentification: number = 10

  constructor(
    @Inject(Restangular) public restangular,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddClientComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.clientForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      idTipoIdentificacion: [5],
      nombres: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      identificacion: [null, [Validators.required, Validators.minLength(this.minLengtIdentification)]]
    })
  }

  save() {
    this.isLoading = true;
    this.clientForm.disable();
    this.restangular.all('clientes').post(this.clientForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    })
  }
}
