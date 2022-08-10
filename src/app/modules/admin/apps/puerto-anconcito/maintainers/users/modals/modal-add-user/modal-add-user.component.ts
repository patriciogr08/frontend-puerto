import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  public userApi: any;
  public minLengtIdentification: number = 10

  constructor(
    @Inject(Restangular) public restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddUserComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userForm = this.createForm(this.data);
    this.userApi = this.restangular[this.data === null ? 'all' : 'one']('users', this.data === null ? null : this.data.id); //ALL para POST y ONE para PUT
  }

  createForm(user) {
    return this.fb.group({
      id: [user ? user.id : null],
      usuario: [user ? user.usuario : null, [Validators.required]],
      primerNombre: [user ? user.primerNombre : null, [Validators.required]],
      segundoNombre: [user ? user.segundoNombre : null, [Validators.required]],
      primerApellido: [user ? user.primerApellido : null, [Validators.required]],
      segundoApellido: [user ? user.segundoApellido : null, [Validators.required]],
      email: [user ? user.email : null, [Validators.required, Validators.email]],
      password: [user ? user.password : null, [Validators.required]],
      password_confirmation: [user ? user.password_confirmation : null, [Validators.required]],
    })
  }

  save() {
    this.isLoading = true;
    this.userForm.disable();
    this.userApi[this.data === null ? 'post' : 'customPUT'](this.userForm.value).subscribe((res: IResponsePA) => {
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
