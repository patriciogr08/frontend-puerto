import { ICellRendererParams } from "ag-grid-community";

export interface IAction {
    id: number;
    name: string;
    icon: string
    tooltip: string | null;
    functionName?: string;
}

export interface ICellRendererParamsCustom extends ICellRendererParams {
    actions: Array<IAction>
}