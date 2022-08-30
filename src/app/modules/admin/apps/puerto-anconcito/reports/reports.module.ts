import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargesComponent } from './charges/charges.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';
import { RecordChargesComponent } from './record-charges/record-charges.component';

const reportsRoutes: Route[] = [
  {
    path: 'charges',
    component: ChargesComponent
  },
  {
    path: 'record-charges',
    component: RecordChargesComponent
  }
];

@NgModule({
  declarations: [
    ChargesComponent,
    RecordChargesComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    ThirdPartyModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(reportsRoutes)
  ]
})
export class ReportsModule { }
