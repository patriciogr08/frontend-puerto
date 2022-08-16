import { Component, OnInit } from '@angular/core';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { ICellRendererParams } from 'ag-grid-community';
import { IAction, ICellRendererParamsCustom } from 'app/shared/interfaces/ag-grid.interface';

@Component({
  selector: 'admin-render-action-buttons',
  templateUrl: './render-action-buttons.component.html',
  styleUrls: ['./render-action-buttons.component.scss']
})
export class RenderActionButtonsComponent implements OnInit {
  //VARIABLES
  public params!: ICellRendererParamsCustom;
  public componentParent: any;
  public isLoading: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParamsCustom): void {
    this.params = params;
    this.componentParent = this.params.context.componentParent;
  }

  actions(action: IAction) {
    this.componentParent[action.functionName !== undefined ? action.functionName : action.name](this.params.data);
  }

  disabledIf(action: IAction) {
    if (action.disableIf) {
      switch (action.disableIf.operator) {
        case '>': return this.params.data[action.disableIf.param] > action.disableIf.condition;
        case '<': return this.params.data[action.disableIf.param] < action.disableIf.condition;
        case '>=': return this.params.data[action.disableIf.param] >= action.disableIf.condition;
        case '<=': return this.params.data[action.disableIf.param] <= action.disableIf.condition;
        case '==': return this.params.data[action.disableIf.param] == action.disableIf.condition;
        case '!=': return this.params.data[action.disableIf.param] != action.disableIf.condition;
        case '===': return this.params.data[action.disableIf.param] === action.disableIf.condition;
        case '!==': return this.params.data[action.disableIf.param] !== action.disableIf.condition;
      }
    }
  }
}
