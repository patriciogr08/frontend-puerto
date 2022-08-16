import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IResponse } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {
  //VARIABLES
  public userForm: FormGroup;
  public isLoading: boolean = false;
  public isEdit: boolean = false;
  public minLengthCode: number = 3
  public userApi: any;

  constructor(
    @Inject(Restangular) public restangular: Restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddUserComponent>,
    public fb: FormBuilder
  ) { 
    
  }

  ngOnInit(): void {
    console.log(this.data)
    this.isEdit = this.data ? true : false;
    this.userForm = this.createForm(this.data);
    this.userApi = this.restangular[this.isEdit ? 'one' : 'all']('users', this.isEdit ? this.data.id : null); //ONE para PUT y ALL para POST
    console.log(this.userApi);
  }

  createForm(user) {
    return this.fb.group({
      id: [user ? user.id : null],
      code: [user ? user.code : null, [Validators.required, Validators.minLength(this.minLengthCode)]],
      name: [user ? user.name : null]
    })
  }

  save() {
    this.isLoading = true;
    this.userForm.disable();
    console.log(this.userForm.value);
    this.userApi[this.isEdit ? 'customPUT' : 'post'](this.userForm.value).subscribe((res: IResponse) => {
      if (res) {
        this.modalAlertService.open('success', res.message.body);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error);
      this.userForm.enable();
      this.isLoading = false;
    })
  }
}