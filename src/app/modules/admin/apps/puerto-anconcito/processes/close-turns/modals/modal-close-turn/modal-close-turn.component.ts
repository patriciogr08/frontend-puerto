import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { IResponse, IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'app-modal-close-turn',
  templateUrl: './modal-close-turn.component.html',
  styleUrls: ['./modal-close-turn.component.scss']
})
export class ModalCloseTurnComponent implements OnInit {
  //VARIABLES
  public user: any;
  public closeTurnForm: FormGroup;
  public isLoading: boolean = false;
  public minLengtIdentification: number = 10

  constructor(
    @Inject(Restangular) public restangular,
    public authService: AuthService,
    public modalAlertService: ModalAlertService,
    public dialogRef: MatDialogRef<ModalCloseTurnComponent>,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.closeTurnForm = this.createForm(this.user);
  }

  createForm(user) {
    return this.fb.group({
      idUsuarioCreacion: [user.id],
      observacionCierre: [null, [Validators.required]],
    })
  }

  save() {
    this.isLoading = true;
    this.closeTurnForm.disable();
    this.restangular.one('historialCobroGarita').all('cerrarTurnoCorbo').post(this.closeTurnForm.value).subscribe((res: IResponsePA) => {
      if (res) {
        this.modalAlertService.open('success', res.success.content);
        this.isLoading = false;
        this.dialogRef.close(res);
      }
    }, (err) => {
        this.modalAlertService.open('error', err.error.error.content.error[0]);
        this.closeTurnForm.enable();
        this.isLoading = false;
    })
  }
}
