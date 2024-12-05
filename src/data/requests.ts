import { PrintRequest, RequestStatus } from '@/types';
import { papers } from './papers';
import { printers } from './printers';

const request1: PrintRequest = {
  id: 'req1',
  name: 'In baitaplon.docx (18 trang, 1 mặt, khổ A4, 10 bản)',
  faces: 1,
  copies: 10,
  rangeStart: 2,
  rangeEnd: 10,
  paper: papers[0],
  startDate: 1733366453000,
  endDate: 1733366493000,
  printer: printers[0],
  status: RequestStatus.COMPLETED,
  creator: {
    name: 'Nguyễn Văn A',
    email: 'a.nguyenvan@hcmut.edu.vn',
    sid: '2252000',
  },
};

const request2: PrintRequest = {
  id: 'req2',
  name: 'In baitaplon.docx (18 trang, 1 mặt, khổ A4, 10 bản)',
  faces: 2,
  copies: 10,
  rangeStart: 2,
  rangeEnd: 10,
  paper: papers[0],
  startDate: 1733366453000,
  endDate: 1733366493000,
  printer: printers[0],
  status: RequestStatus.PENDING,
  creator: {
    name: 'Nguyễn Văn A',
    email: 'a.nguyenvan@hcmut.edu.vn',
    sid: '2252000',
  },
};

const request3: PrintRequest = {
  id: 'req3',
  name: 'In baitaplon.docx (18 trang, 1 mặt, khổ A4, 10 bản)',
  faces: 2,
  copies: 20,
  rangeStart: 1,
  rangeEnd: 10,
  paper: papers[0],
  startDate: 1733366253000,
  endDate: 1733366193000,
  printer: printers[0],
  status: RequestStatus.REFUSED,
  creator: {
    name: 'Nguyễn Văn A',
    email: 'a.nguyenvan@hcmut.edu.vn',
    sid: '2252000',
  },
};

const request4: PrintRequest = {
  id: 'req4',
  name: 'In baitaplon.docx (18 trang, 1 mặt, khổ A4, 10 bản)',
  faces: 2,
  copies: 10,
  rangeStart: 2,
  rangeEnd: 10,
  paper: papers[0],
  startDate: 1733366453000,
  endDate: 1733366493000,
  printer: printers[0],
  status: RequestStatus.COMPLETED,
  creator: {
    name: 'Nguyễn Văn A',
    email: 'a.nguyenvan@hcmut.edu.vn',
    sid: '2252000',
  },
};

const request5: PrintRequest = {
  id: 'req5',
  name: 'In baitaplon.docx (18 trang, 1 mặt, khổ A4, 10 bản)',
  faces: 2,
  copies: 10,
  rangeStart: 2,
  rangeEnd: 10,
  paper: papers[0],
  startDate: 1733366453000,
  endDate: 1733366493000,
  printer: printers[0],
  status: RequestStatus.COMPLETED,
  creator: {
    name: 'Nguyễn Văn A',
    email: 'a.nguyenvan@hcmut.edu.vn',
    sid: '2252000',
  },
};

export const requests = [
  request1,
  request2,
  request2,
  request2,
  request3,
  request4,
  request2,
  request5,
];
