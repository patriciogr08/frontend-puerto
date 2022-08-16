import { ICellRendererParams } from "ag-grid-community";

interface IDisableIf {
    param: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!='| '==='| '!==';
    condition: any;
}
export interface IAction {
    id: number;
    name: string;
    icon: string
    tooltip: string | null;
    functionName?: string;
    disableIf?: IDisableIf;
}

export interface ICellRendererParamsCustom extends ICellRendererParams {
    actions: Array<IAction>
}