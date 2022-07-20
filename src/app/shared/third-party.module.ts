import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { FileSaverModule } from 'ngx-filesaver';
// import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    AgGridModule,
    TranslocoModule,
    NgxMatSelectSearchModule,
    // FileSaverModule,
    // NgxDropzoneModule
  ]
})
export class ThirdPartyModule { }
