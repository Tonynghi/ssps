import { RequestStatus, Transaction } from '@/types';

const transaction1: Transaction = {
  name: 'Giấy A4 x5, Giấy A3 x6',
  price: 9500,
  date: 1729501200000,
  status: RequestStatus.COMPLETED,
};

const transaction2: Transaction = {
  name: 'Giấy A4 x5, Giấy A3 x6',
  price: 9500,
  date: 1729501200000,
  status: RequestStatus.PENDING,
};

export const transactions = [transaction1, transaction2];
