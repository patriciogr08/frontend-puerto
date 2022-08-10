import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectSearchComponent } from './mat-select-search/mat-select-search.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalFuseAlertComponent } from './modal-fuse-alert/modal-fuse-alert.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { RenderActionButtonsComponent } from './render-action-buttons/render-action-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    MatSelectSearchComponent,
    ModalFuseAlertComponent,
    RenderActionButtonsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    FuseAlertModule,
    TranslocoModule,

    //Material
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [
    MatSelectSearchComponent,
    ModalFuseAlertComponent
  ]
})
export class ComponentsModule { }
