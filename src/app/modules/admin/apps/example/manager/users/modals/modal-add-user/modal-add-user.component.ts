import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(
    @Inject(Restangular) public restangular,
    // public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddUserComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      code: [null, [Validators.required, Validators.minLength(this.minLengthCode)]],
      name: []
    })
  }

  save() {
    this.isLoading = true;
    this.userForm.disable();
    this.restangular.all('user').post(this.userForm.value).subscribe((res: IResponse) => {
      this.dialogRef.close(res.data);
      this.isLoading = false;
      // this.modalAlertService.openAlert(res.message.type, res.message.body, false);
    })
  }
}
