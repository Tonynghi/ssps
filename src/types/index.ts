export type User = {
  name: string;
  email: string;
  sid: string;
};

export type Paper = {
  name: string;
  width: number;
  height: number;
};

export type Printer = {
  id: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  branch: '268 Lý Thường Kiệt' | 'Dĩ An';
  block: string;
  room: number;
  disabled: boolean;
};

export type PrintInfo = {
  name: string;
  faces: number;
  copies: number;
  rangeStart: number;
  rangeEnd: number;
  paper: Paper;
  printer: Printer;
};

export enum RequestStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  REFUSED = 'REFUSED',
}

export type PrintRequest = {
  id: string;
  name: string;
  faces: number;
  copies: number;
  rangeStart: number;
  rangeEnd: number;
  paper: Paper;
  startDate: number;
  endDate: number;
  printer: Printer;
  status: RequestStatus;
  creator: User;
};

export type Transaction = {
  name: string;
  price: number;
  date: number;
  status: RequestStatus;
};

export type ChartData = {
  title: string;
  dataValues: Array<number>;
  dataLabels: Array<string>;
  dataColors: Array<string>;
};
