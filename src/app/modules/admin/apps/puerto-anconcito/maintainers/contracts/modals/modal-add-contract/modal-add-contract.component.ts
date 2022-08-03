import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalAddUserComponent } from '../../../users/modals/modal-add-user/modal-add-user.component';

@Component({
  selector: 'admin-modal-add-contract',
  templateUrl: './modal-add-contract.component.html',
  styleUrls: ['./modal-add-contract.component.scss']
})
export class ModalAddContractComponent implements OnInit {
  //VARIABLES
  public contractForm: FormGroup;
  public isLoading: boolean = false;
  public fileCurriculum: File;
  public fileReferences: File;
  public file: File;
  public cv: FormControl = new FormControl();
  public referencias: FormControl = new FormControl();
  
  //ARRAYS
  public users: Array<any> = [];
  public files: File[] = [];

  public _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(Restangular) public restangular,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalAddUserComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.contractForm = this.createForm();
    this.getUsers();
  }

  createForm() {
    return this.fb.group({
      id: [null],
      idEmpleado: [null, [Validators.required]],
      cv: [null, [Validators.required]],
      referencias: [null, [Validators.required]],
      renovacion: [false, [Validators.required]],
      mesesContrato: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
    })
  }

  getUsers() {
    this.restangular.one('controlEmpleados').all('usuarios').customGET('obtenerUsuarios').pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
      if (res) {
        this.users = res.data;
      }
    })
  }

  onSelect(control, event) {
    this.file = event.addedFiles[0];
    this[control].setValue(this.file.name);
    this.getBase64(this.file, (data) => {
      const base64 = data.target.result;
      const base64Object = {
        dataObject: base64
      }
      this.contractForm.get(control).setValue(base64Object);
    })
	}

  onRemove(event) {
		this.files.splice(this.files.indexOf(event), 1);
	}

  getBase64(file: File, onLoadCallback) {
    let reader = new FileReader();
    reader.onload = onLoadCallback;
    reader.readAsDataURL(file);
 }

  save() {
    this.isLoading = true;
    this.contractForm.disable();
    this.cv.disable();
    this.referencias.disable();
    this.restangular.all('controlEmpleados').post(this.contractForm.value).subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.dialogRef.close(res.data);
        this.isLoading = false;
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
      this.contractForm.enable();
      this.cv.enable();
      this.referencias.enable();
      this.isLoading = false;
    })
  }
}
