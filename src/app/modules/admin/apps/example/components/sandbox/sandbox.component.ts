import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {
  //VARIABLES
  public items: Array<any> = [];
  public items2: Array<any> = []
  public form: FormGroup

  constructor(
    public fb: FormBuilder,
    private fuseConfirmationService: FuseConfirmationService,
    private modalFuseAlertService: ModalAlertService,
  ) {
    this.form = this.createForm();
    this.items = [
      {
        id: 1,
        name: 'Manzana'
      },
      {
        id: 2,
        name: 'Pera'
      },
      {
        id: 3,
        name: 'Melon'
      },
      {
        id: 4,
        name: 'Sandia'
      },
    ];
    this.items2 = [
      {
        id: 1,
        nombre: 'Manzana'
      },
      {
        id: 2,
        nombre: 'Pera'
      },
      {
        id: 3,
        nombre: 'Melon'
      },
      {
        id: 4,
        nombre: 'Sandia'
      },
    ]
  }

  ngOnInit(): void {
    
  }

  setItemSelectSeach(data) {
    console.log(data);
  }

  createForm() {
    return this.fb.group({
      fruitId: [2]
    })
  }

  openConfirmationDialog() {
    // Open the confirmation and save the reference
    const config: FuseConfirmationConfig = {

    }
    const dialogRef = this.fuseConfirmationService.open({

    });

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  openFuseAlertDialog() {
    const res = {
      type: 'success',
      message: 'Transacción Correcta'
    }
    this.modalFuseAlertService.open(res.type, res.message, false);
  }

}
