import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { Route, RouterModule } from '@angular/router';

const maintainersRoutes: Route[] = [
  {
      path     : 'orders',
      component: OrdersComponent
  }
];

@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(maintainersRoutes)
  ]
})
export class MaintainersModule { }
