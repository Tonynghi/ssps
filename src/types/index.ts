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
