import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { FuseAlertModule } from '@fuse/components/alert';

@NgModule({
    imports: [
        // CommonModule,
        // FormsModule,
        // ReactiveFormsModule,
        // ComponentsModule,
        // FuseAlertModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        FuseConfirmationModule,
        FuseAlertModule 
    ]
})
export class SharedModule
{
}
