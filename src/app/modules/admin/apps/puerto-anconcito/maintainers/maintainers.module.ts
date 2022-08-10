import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';
import { ModalAddClientComponent } from './clients/modals/modal-add-client/modal-add-client.component';
import { ParamsComponent } from './params/params.component';
import { ParamsParentsComponent } from './params/params-parents/params-parents.component';
import { ParamsChildsComponent } from './params/params-childs/params-childs.component';
import { UsersComponent } from './users/users.component';
import { ModalAddUserComponent } from './users/modals/modal-add-user/modal-add-user.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ModalAddContractComponent } from './contracts/modals/modal-add-contract/modal-add-contract.component';
import { ModalAddParamChildComponent } from './params/params-childs/modals/modal-add-param-child/modal-add-param-child.component';
import { RolesComponent } from './roles/roles.component';
import { ModalAddRoleComponent } from './roles/modals/modal-add-role/modal-add-role.component';
import { ModalListRolesComponent } from './users/modals/modal-list-roles/modal-list-roles.component';

const maintainersRoutes: Route[] = [
  {
    path: 'clients',
    component: ClientsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'contracts',
    component: ContractsComponent
  },
  {
    path: 'params',
    component: ParamsComponent
  },
];

@NgModule({
  declarations: [
    ClientsComponent,
    ModalAddClientComponent,
    UsersComponent,
    ContractsComponent,
    ModalAddUserComponent,
    ModalAddContractComponent,
    ParamsComponent,
    ParamsParentsComponent,
    ParamsChildsComponent,
    ModalAddParamChildComponent,
    RolesComponent,
    ModalAddRoleComponent,
    ModalListRolesComponent,
  ],
  imports: [
    ThirdPartyModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(maintainersRoutes)
  ]
})
export class MaintainersModule { }
