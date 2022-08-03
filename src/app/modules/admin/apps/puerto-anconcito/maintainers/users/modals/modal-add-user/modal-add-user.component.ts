import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'admin-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {
  //VARIABLES
  public userForm: FormGroup;
  public isLoading: boolean = false;
  public minLengtIdentification: number = 10

  constructor(
    @Inject(Restangular) public restangular,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddUserComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      id: [null],
      usuario: [null, [Validators.required]],
      primerNombre: [null, [Validators.required]],
      segundoNombre: [null, [Validators.required]],
      primerApellido: [null, [Validators.required]],
      segundoApellido: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      password_confirmation: [null, [Validators.required]],
    })
  }

  save() {
    this.isLoading = true;
    this.userForm.disable();
    this.restangular.all('users').post(this.userForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
      this.userForm.enable();
      this.isLoading = false;
    })
  }
}
