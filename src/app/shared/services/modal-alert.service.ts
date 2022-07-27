import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { ModalFuseAlertComponent } from '../components/modal-fuse-alert/modal-fuse-alert.component';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class ModalAlertService {
  public message: string = ''
  public config = {
    style: 'sweet'
  }

  constructor(
    public dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private translocoService: TranslocoService 
  ) {
    this.translocoService.selectTranslate('defaultTexts.alertMessage').subscribe((data) => {
      this.message = data;
    })
  }

  open(type?: any, message?: string, showConfirmButton: boolean = true, timer: number = 3000) {
    message = message !== null ? message : this.message;
    const action = showConfirmButton ? 'Cerrar' : '';
    timer = showConfirmButton ? 0 : timer;
    switch (this.config.style) {
      case 'fuse':
        this.openFuseAlert(type, message);
        break;
      case 'snackbar':
        this.openSnackbarAlert(message, action, timer);
        break;
      case 'sweet':
        this.openSweetAlert(type, message, showConfirmButton, timer);
        break;
      default:
        break;
    }

  }

  openFuseAlert(type: FuseAlertType, message: string) {
    const dialogRef = this.dialog.open(ModalFuseAlertComponent, {
      data: {
        type,
        message
      },
      position: { bottom: '24px' },
      hasBackdrop: false,
      panelClass: 'clean-mat-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openSnackbarAlert(message: string, action: string, timer: number) {
    this.matSnackBar.open(message, action, {
      duration: timer
    });
  }

  openSweetAlert(icon: any, text: string, showConfirmButton: boolean, timer: number) {
    Swal.fire({
      icon: icon,
      text: text,
      showConfirmButton: showConfirmButton,
      timer: timer,
    })
  }
}
