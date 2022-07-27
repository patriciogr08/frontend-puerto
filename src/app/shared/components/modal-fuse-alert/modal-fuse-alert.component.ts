import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';

@Component({
  selector: 'admin-modal-fuse-alert',
  templateUrl: './modal-fuse-alert.component.html',
  styleUrls: ['./modal-fuse-alert.component.scss']
})
export class ModalFuseAlertComponent implements OnInit {
  //VARIABLES
  public message: string = null

  constructor(
    private fuseAlertService: FuseAlertService,
    public dialogRef: MatDialogRef<ModalFuseAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.openAlert(this.data.type);
  }

  openAlert(name) {
    this.fuseAlertService.show(name);
  }

  onCloseAlert(isClosed: boolean) {
    this.dialogRef.close(isClosed);
  }

}
