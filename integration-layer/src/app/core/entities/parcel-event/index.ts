export interface IParcelEvent {
  guid: string;
  parcelNumber: string;
}

export interface IParcelEventRead extends IParcelEvent {
  seq: string;
}
