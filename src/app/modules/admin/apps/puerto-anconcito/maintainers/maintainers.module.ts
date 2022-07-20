import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';
import { ModalAddClientComponent } from './clients/modals/modal-add-client/modal-add-client.component';

const maintainersRoutes: Route[] = [
  {
      path     : 'clients',
      component: ClientsComponent
  }
];

@NgModule({
  declarations: [
    ClientsComponent,
    ModalAddClientComponent
  ],
  imports: [
    CommonModule,
    ThirdPartyModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(maintainersRoutes)
  ]
})
export class MaintainersModule { }
