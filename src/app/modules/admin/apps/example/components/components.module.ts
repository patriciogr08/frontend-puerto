import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxComponent } from './sandbox/sandbox.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';

const componentsRoutes: Route[] = [
  {
    path: 'sandbox',
    component: SandboxComponent
  }
];

@NgModule({
  declarations: [
    SandboxComponent
  ],
  imports: [
    ThirdPartyModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(componentsRoutes)
  ]
})
export class ComponentsModule { }
