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