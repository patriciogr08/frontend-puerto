import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketTurnsComponent } from './ticket-turns/ticket-turns.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyModule } from 'app/shared/third-party.module';
import { CloseTurnsComponent } from './close-turns/close-turns.component';
import { ModalCloseTurnComponent } from './close-turns/modals/modal-close-turn/modal-close-turn.component';

const processesRoutes: Route[] = [
  {
    path: 'turns',
    component: TicketTurnsComponent
  },
  {
    path: 'close-turns',
    component: CloseTurnsComponent
  }
];

@NgModule({
  declarations: [
    TicketTurnsComponent,
    CloseTurnsComponent,
    ModalCloseTurnComponent
  ],
  imports: [
    CommonModule,
    ThirdPartyModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(processesRoutes)
  ]
})
export class ProcessesModule { }
