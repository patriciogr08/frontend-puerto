import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargesComponent } from './charges/charges.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';

const reportsRoutes: Route[] = [
  {
    path: 'charges',
    component: ChargesComponent
  }
];

@NgModule({
  declarations: [
    ChargesComponent
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
