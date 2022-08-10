export interface IData {
    row: object,
}

export interface IMessage {
    body: string,
    title: string,
    type: string
}

export interface IResponse {
    data: IData,
    message: IMessage
}

export interface ISuccess {
    code: number,
    content: string,
}

export interface IResponsePA {
    data: any,
    error: object,
    success: ISuccess
}