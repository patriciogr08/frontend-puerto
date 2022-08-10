import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'admin-modal-add-role',
  templateUrl: './modal-add-role.component.html',
  styleUrls: ['./modal-add-role.component.scss']
})
export class ModalAddRoleComponent implements OnInit {
  //VARIABLES
  public roleForm: FormGroup;
  public isLoading: boolean = false;
  public roleApi: any;
  public minLengtIdentification: number = 10

  constructor(
    @Inject(Restangular) public restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddRoleComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.roleForm = this.createForm(this.data);
    this.roleApi = this.restangular[this.data === null ? 'all' : 'one']('roles', this.data === null ? null : this.data.id); //ALL para POST y ONE para PUT
  }

  createForm(role) {
    return this.fb.group({
      id: [role ? role.id : null],
      name: [role ? role.name : null, [Validators.required]],
      description: [role ? role.description : null, [Validators.required]]
    })
  }

  save() {
    this.isLoading = true;
    this.roleForm.disable();
    this.roleApi[this.data === null ? 'post' : 'customPUT'](this.roleForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
      this.roleForm.enable();
      this.isLoading = false;
    })
  }
}
