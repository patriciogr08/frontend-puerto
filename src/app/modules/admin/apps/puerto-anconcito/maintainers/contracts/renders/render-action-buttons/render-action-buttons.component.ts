import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { IResponsePA } from 'app/shared/interfaces/response.interface';
import { ModalAlertService } from 'app/shared/services/modal-alert.service';
import { Restangular } from 'ngx-restangular';

@Component({
  selector: 'admin-render-action-buttons',
  templateUrl: './render-action-buttons.component.html',
  styleUrls: ['./render-action-buttons.component.scss']
})
export class RenderActionButtonsComponent implements OnInit {
  //VARIABLES
  public params: ICellRendererParams;
  public isLoading: boolean = false;

  constructor(
    public modalAlertService: ModalAlertService,
    @Inject(Restangular) public restangular,
    // private fileSaverService: FileSaverService,
  ) { }

  ngOnInit(): void {
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  delete() {
    this.restangular.one('controlEmpleados', this.params.data.id).remove().subscribe((res: IResponsePA) => {
      if (res.success) {
        this.modalAlertService.open('success', res.success.content);
        this.isLoading = false;
      }
    }, (err) => {
      this.modalAlertService.open('error', err.error.error.content.error ? err.error.error.content.error[0] : err.error.error.content.password[0]);
      this.isLoading = false;
    })
  }
}
