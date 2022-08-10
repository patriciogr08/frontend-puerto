import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IResponse } from 'app/shared/interfaces/response.interface';
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
  public minLengthCode: number = 3
  public userApi: any;

  constructor(
    @Inject(Restangular) public restangular: Restangular,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddUserComponent>,
    public fb: FormBuilder
  ) { 
    
  }

  ngOnInit(): void {
    console.log(this.data)
    this.userForm = this.createForm(this.data);
    this.userApi = this.restangular[this.data === null ? 'all' : 'one']('users', this.data === null ? null : this.data.id); //ALL para POST y ONE para PUT
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
    this.userApi[this.data === null ? 'post' : 'customPUT'](this.userForm.value).subscribe((res: IResponse) => {
      this.dialogRef.close(res.data);
      this.isLoading = false;
      // this.modalAlertService.openAlert(res.message.type, res.message.body, false);
    })
  }
}
