import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';
import { ModalAddUserComponent } from './users/modals/modal-add-user/modal-add-user.component';

const managerRoutes: Route[] = [
  {
    path: 'users',
    component: UsersComponent
  }
];

@NgModule({
  declarations: [
    UsersComponent,
    ModalAddUserComponent
  ],
  imports: [
    CommonModule,
    ThirdPartyModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(managerRoutes)
  ]
})
export class ManagerModule { }
