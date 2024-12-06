import Rect from '@/components/icons/rect';
import Search from '@/components/icons/search';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import { requests } from '@/data/requests';
import { dateFormatter } from '@/helpers/dateFormatter';
import { Printer, PrintRequest, RequestStatus, Transaction } from '@/types';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { transactions } from '@/data/transactions';
import Profile from '@/components/icons/profile';
import Last from '@/components/icons/last';
import Next from '@/components/icons/next';
import { printers } from '@/data/printers';
import { BarChart } from '@/components/ui/charts';

export const Route = createFileRoute('/statistics/')({
  component: Statistics,
});

function Statistics() {
  const printerData = printers.map((printer, index) => {
    return {
      printer,
      requests: 90 - index,
    };
  });
  const [order, setOrder] = useState(false);
  const [content, setContent] = useState(true);
  const [requestList, setRequestList] = useState(requests);
  const [printerList, setPrinterList] = useState(printerData);
  const columnHelper = createColumnHelper<PrintRequest>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [transactionPagination, setTransactionPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });
  const [printerPagination, setPrinterPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const transactionColumnHelper = createColumnHelper<Transaction>();
  const printerColumnHelper = createColumnHelper<{
    printer: Printer;
    requests: number;
  }>();

  const columns: ColumnDef<PrintRequest, any>[] = [
    columnHelper.accessor('name', {
      id: 'index',
      header: () => <span>#</span>,
      cell: (info) => <span>{info.row.index + 1}</span>,
    }),
    columnHelper.accessor('name', {
      id: 'name',
      header: () => <span>Tên yêu cầu</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor('startDate', {
      id: 'startDate',
      header: () => <span>Thời gian</span>,
      cell: (info) => <span>{dateFormatter(info.getValue())}</span>,
    }),
    columnHelper.accessor('printer', {
      id: 'printer',
      header: () => <span>Máy in</span>,
      cell: (info) => {
        const printer = info.getValue().name;
        const block = info.getValue().block;
        return (
          <span>
            {printer} (Toà {block})
          </span>
        );
      },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => <span>Trạng thái</span>,
      cell: (info) => {
        if (info.getValue() === RequestStatus.COMPLETED)
          return (
            <span className="rounded-lg py-1 px-4 font-bold text-white bg-green">
              Hoàn thành
            </span>
          );
        if (info.getValue() === RequestStatus.PENDING)
          return (
            <span className="rounded-lg py-1 px-4 font-bold text-white bg-yellow">
              Đang xử lý
            </span>
          );
        return (
          <span className="rounded-lg py-1 px-4 font-bold text-white bg-red">
            Bị từ chối
          </span>
        );
      },
    }),
    columnHelper.accessor('creator', {
      id: 'creator',
      header: () => <span>Người yêu cầu</span>,
      cell: (info) => (
        <div className="relative flex flex-row gap-4 items-center cursor-pointer">
          <Profile className="size-6" />
          <div>
            {info.getValue().name} -{' '}
            <span className="font-bold">{info.getValue().sid}</span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'action',
      header: () => <span></span>,
      cell: (info) => (
        <span>
          <Link
            to="/request"
            className="rounded-lg py-1 px-4 font-bold text-white bg-primary"
          >
            Xem chi tiết
          </Link>
        </span>
      ),
    }),
  ];

  const transactionColumns: ColumnDef<Transaction, any>[] = [
    transactionColumnHelper.accessor('name', {
      id: 'index',
      header: () => <span>#</span>,
      cell: (info) => <span>{info.row.index + 1}</span>,
    }),
    transactionColumnHelper.accessor('name', {
      id: 'name',
      header: () => <span>Tên yêu cầu</span>,
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    transactionColumnHelper.accessor('date', {
      id: 'date',
      header: () => <span>Thời gian</span>,
      cell: (info) => <span>{dateFormatter(info.getValue())}</span>,
    }),
    transactionColumnHelper.accessor('status', {
      id: 'status',
      header: () => <span>Trạng thái</span>,
      cell: (info) => {
        if (info.getValue() === RequestStatus.COMPLETED)
          return (
            <span className="rounded-lg py-1 px-4 font-bold text-white bg-green">
              Đã thanh toán
            </span>
          );
        return (
          <span className="rounded-lg py-1 px-4 font-bold text-white bg-[#92ABCF]">
            Đang xử lý
          </span>
        );
      },
    }),
  ];

  const printerColumns: ColumnDef<
    {
      printer: Printer;
      requests: number;
    },
    any
  >[] = [
    printerColumnHelper.accessor('printer', {
      id: 'index',
      header: () => <span className="pl-4">#</span>,
      cell: (info) => <span className="pl-4">{info.row.index + 1}</span>,
    }),
    printerColumnHelper.accessor('printer', {
      id: 'name',
      header: () => <span>Máy in</span>,
      cell: (info) => <span>{info.getValue().name}</span>,
    }),
    printerColumnHelper.accessor('printer', {
      id: 'location',
      header: () => <span>Vị trí</span>,
      cell: (info) => (
        <span>
          Phòng {info.getValue().room} Tòa {info.getValue().block}
        </span>
      ),
    }),
    printerColumnHelper.accessor('requests', {
      id: 'requests',
      header: () => (
        <span className="flex items-center pr-4 justify-end">Số yêu cầu</span>
      ),
      cell: (info) => (
        <span className="flex items-center pr-4 justify-end">
          {info.getValue()}
        </span>
      ),
    }),
  ];

  const table = useReactTable<PrintRequest>({
    data: requestList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const transactionTable = useReactTable<Transaction>({
    data: transactions,
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setTransactionPagination,
    state: {
      pagination: transactionPagination,
    },
  });

  const printerTable = useReactTable<{ printer: Printer; requests: number }>({
    data: printerList,
    columns: printerColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPrinterPagination,
    state: {
      pagination: printerPagination,
    },
  });

  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        <Section className="flex relative !flex-row justify-between">
          <div className="flex relative flex-col gap-7">
            <div className="relative flex flex-row gap-6 p-6 rounded-2xl bg-gradient-to-r shadow-xl from-[#022A93] to-[rgb(20,136,219)]">
              <div className="bg-white w-[15rem] relative items-center p-4 justify-between flex flex-row rounded-lg">
                <div className="relative flex flex-col justify-between">
                  <div className="text-[12px]">Tổng số yêu cầu in ấn</div>
                  <div className="text-[36px] font-bold text-transparent bg-gradient-to-b from-[#022A93] to-[#1488DB] bg-clip-text">
                    {(5000).toLocaleString()}
                  </div>
                </div>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-16"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="40"
                    fill="url(#paint0_linear_470_2451)"
                  />
                  <path
                    d="M49.3971 20C50.0052 20 50.5925 20.2216 51.0489 20.6234L56.0268 25.0052C56.566 25.4798 56.875 26.1634 56.875 26.8817V56.25C56.875 58.3211 55.1961 60 53.125 60H26.875C24.8039 60 23.125 58.3211 23.125 56.25V23.75C23.125 21.6789 24.8039 20 26.875 20H49.3971Z"
                    fill="#DAE4F4"
                  />
                  <path
                    d="M49.3971 20C50.0052 20 50.5925 20.2216 51.0489 20.6234L56.0268 25.0052C56.566 25.4798 56.875 26.1634 56.875 26.8817V28.75H53.125C51.0539 28.75 49.375 27.0711 49.375 25V20H49.3971Z"
                    fill="#92ABCF"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_470_2451"
                      x1="40"
                      y1="0"
                      x2="40"
                      y2="80"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#022A93" />
                      <stop offset="1" stop-color="#1488DB" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="bg-white w-[15rem] relative items-center p-4 justify-between flex flex-row rounded-lg">
                <div className="relative flex flex-col justify-between">
                  <div className="text-[12px]">Tổng số giao dịch</div>
                  <div className="text-[36px] font-bold text-transparent bg-gradient-to-b from-[#022A93] to-[#1488DB] bg-clip-text">
                    {(300).toLocaleString()}
                  </div>
                </div>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-16"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="40"
                    fill="url(#paint0_linear_470_2457)"
                  />
                  <path d="M52.5 22.5H27.5V27.5H52.5V22.5Z" fill="#1488DB" />
                  <path
                    d="M52.5 28.75H27.5C27.1685 28.75 26.8505 28.6183 26.6161 28.3839C26.3817 28.1495 26.25 27.8315 26.25 27.5V22.5C26.25 22.1685 26.3817 21.8505 26.6161 21.6161C26.8505 21.3817 27.1685 21.25 27.5 21.25H52.5C52.8315 21.25 53.1495 21.3817 53.3839 21.6161C53.6183 21.8505 53.75 22.1685 53.75 22.5V27.5C53.75 27.8315 53.6183 28.1495 53.3839 28.3839C53.1495 28.6183 52.8315 28.75 52.5 28.75ZM28.75 26.25H51.25V23.75H28.75V26.25Z"
                    fill="#374458"
                  />
                  <path d="M50 27.5H30V35H50V27.5Z" fill="#022A93" />
                  <path
                    d="M50 36.25H30C29.6685 36.25 29.3505 36.1183 29.1161 35.8839C28.8817 35.6495 28.75 35.3315 28.75 35V27.5C28.75 27.1685 28.8817 26.8505 29.1161 26.6161C29.3505 26.3817 29.6685 26.25 30 26.25H50C50.3315 26.25 50.6495 26.3817 50.8839 26.6161C51.1183 26.8505 51.25 27.1685 51.25 27.5V35C51.25 35.3315 51.1183 35.6495 50.8839 35.8839C50.6495 36.1183 50.3315 36.25 50 36.25ZM31.25 33.75H48.75V28.75H31.25V33.75Z"
                    fill="#374458"
                  />
                  <path d="M47.5 35H32.5V57.5H47.5V35Z" fill="#DAE4F4" />
                  <path
                    d="M47.5 58.75H32.5C32.1685 58.75 31.8505 58.6183 31.6161 58.3839C31.3817 58.1495 31.25 57.8315 31.25 57.5V35C31.25 34.6685 31.3817 34.3505 31.6161 34.1161C31.8505 33.8817 32.1685 33.75 32.5 33.75H47.5C47.8315 33.75 48.1495 33.8817 48.3839 34.1161C48.6183 34.3505 48.75 34.6685 48.75 35V57.5C48.75 57.8315 48.6183 58.1495 48.3839 58.3839C48.1495 58.6183 47.8315 58.75 47.5 58.75ZM33.75 56.25H46.25V36.25H33.75V56.25Z"
                    fill="#374458"
                  />
                  <path d="M37.5 35H32.5V57.5H37.5V35Z" fill="#92ABCF" />
                  <path
                    d="M37.5 58.75H32.5C32.1685 58.75 31.8505 58.6183 31.6161 58.3839C31.3817 58.1495 31.25 57.8315 31.25 57.5V35C31.25 34.6685 31.3817 34.3505 31.6161 34.1161C31.8505 33.8817 32.1685 33.75 32.5 33.75H37.5C37.8315 33.75 38.1495 33.8817 38.3839 34.1161C38.6183 34.3505 38.75 34.6685 38.75 35V57.5C38.75 57.8315 38.6183 58.1495 38.3839 58.3839C38.1495 58.6183 37.8315 58.75 37.5 58.75ZM33.75 56.25H36.25V36.25H33.75V56.25Z"
                    fill="#374458"
                  />
                  <path
                    d="M42.5 41.9502C43.5355 41.9502 44.375 41.1107 44.375 40.0752C44.375 39.0397 43.5355 38.2002 42.5 38.2002C41.4645 38.2002 40.625 39.0397 40.625 40.0752C40.625 41.1107 41.4645 41.9502 42.5 41.9502Z"
                    fill="#DAE4F4"
                  />
                  <path
                    d="M42.5 43.2002C41.8819 43.2002 41.2777 43.0169 40.7638 42.6735C40.2499 42.3302 39.8494 41.8421 39.6129 41.2711C39.3764 40.7001 39.3145 40.0717 39.435 39.4655C39.5556 38.8593 39.8533 38.3025 40.2903 37.8655C40.7273 37.4284 41.2842 37.1308 41.8903 37.0102C42.4965 36.8897 43.1249 36.9515 43.6959 37.1881C44.2669 37.4246 44.755 37.8251 45.0983 38.339C45.4417 38.8529 45.625 39.4571 45.625 40.0752C45.625 40.4856 45.5442 40.8919 45.3871 41.2711C45.2301 41.6502 44.9999 41.9947 44.7097 42.2849C44.4195 42.5751 44.075 42.8053 43.6959 42.9623C43.3167 43.1194 42.9104 43.2002 42.5 43.2002ZM42.5 39.4502C42.3342 39.4502 42.1753 39.516 42.0581 39.6333C41.9408 39.7505 41.875 39.9094 41.875 40.0752C41.875 40.241 41.9408 40.3999 42.0581 40.5171C42.1753 40.6343 42.3342 40.7002 42.5 40.7002C42.6658 40.7002 42.8247 40.6343 42.9419 40.5171C43.0592 40.3999 43.125 40.241 43.125 40.0752C43.125 39.9094 43.0592 39.7505 42.9419 39.6333C42.8247 39.516 42.6658 39.4502 42.5 39.4502Z"
                    fill="#374458"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_470_2457"
                      x1="40"
                      y1="0"
                      x2="40"
                      y2="80"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#022A93" />
                      <stop offset="1" stop-color="#1488DB" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="bg-white w-[15rem] relative items-center p-4 justify-between flex flex-row rounded-lg">
                <div className="relative flex flex-col justify-between">
                  <div className="text-[12px]">Tổng số người dùng</div>
                  <div className="text-[36px] font-bold text-transparent bg-gradient-to-b from-[#022A93] to-[#1488DB] bg-clip-text">
                    {(10000).toLocaleString()}
                  </div>
                </div>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-16"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="40"
                    fill="url(#paint0_linear_470_2494)"
                  />
                  <path
                    opacity="0.4"
                    d="M56.6667 33.0163V46.983C56.6667 51.6663 54.5167 54.883 50.7334 56.0997C49.6334 56.483 48.3667 56.6663 46.9834 56.6663H33.0167C31.6334 56.6663 30.3667 56.483 29.2667 56.0997C25.4834 54.883 23.3334 51.6663 23.3334 46.983V33.0163C23.3334 26.9497 26.95 23.333 33.0167 23.333H46.9834C53.05 23.333 56.6667 26.9497 56.6667 33.0163Z"
                    fill="#DAE4F4"
                  />
                  <path
                    d="M50.7343 56.0999C49.6343 56.4832 48.3677 56.6665 46.9843 56.6665H33.0176C31.6342 56.6665 30.3676 56.4832 29.2676 56.0999C29.8509 51.6999 34.4509 48.2832 40.0008 48.2832C45.5508 48.2832 50.151 51.6999 50.7343 56.0999Z"
                    fill="#DAE4F4"
                  />
                  <path
                    d="M45.9665 39.2997C45.9665 42.5997 43.2998 45.283 39.9998 45.283C36.6998 45.283 34.0332 42.5997 34.0332 39.2997C34.0332 35.9997 36.6998 33.333 39.9998 33.333C43.2998 33.333 45.9665 35.9997 45.9665 39.2997Z"
                    fill="#DAE4F4"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_470_2494"
                      x1="40"
                      y1="0"
                      x2="40"
                      y2="80"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#022A93" />
                      <stop offset="1" stop-color="#1488DB" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="bg-white h-[20rem] shadow-xl gap-6 rounded-2xl w-full flex flex-col p-6 z-10">
              <div className="font-bold text-[20px]">
                Số yêu cầu in ấn theo thời gian{' '}
                <span className="font-normal text-[#92ABCF]">(chục bản)</span>
              </div>
              <BarChart
                chartData={{
                  title: 'Số yêu cầu in ấn theo thời gian (chục bản)',
                  dataValues: [4, 3, 9, 8, 4, 4, 4, 8, 4, 4, 8, 4],
                  dataLabels: [
                    '1/2024',
                    '2/2024',
                    '3/2024',
                    '4/2024',
                    '5/2024',
                    '6/2024',
                    '7/2024',
                    '8/2024',
                    '9/2024',
                    '10/2024',
                    '11/2024',
                    '12/2024',
                  ],
                  dataColors: [
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                    '#1488DB',
                  ],
                }}
              />
            </div>
          </div>
          <div className="bg-white shadow-xl gap-6 rounded-2xl w-[30rem] flex flex-col p-6">
            <div className="font-bold text-[20px]">
              Máy in được sử dụng nhiều nhất
            </div>
            <table className="">
              <thead>
                {printerTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-start px-2 py-4 bg-[#374458] text-white"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {printerTable.getRowModel().rows.map((row) => (
                  <tr
                    className="border-y border-solid border-[#374458]"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="relative flex flex-row gap-2 items-center self-center">
              <Last
                onClick={() => {
                  printerTable.firstPage();
                }}
                className={`${printerTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} cursor-pointer`}
              />
              <Next
                onClick={() => {
                  if (printerTable.getState().pagination.pageIndex + 1 === 1)
                    return;
                  printerTable.previousPage();
                }}
                className={`${printerTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} cursor-pointer`}
              />
              <div
                onClick={() => {
                  printerTable.setPageIndex(0);
                }}
                className={`${printerTable.getState().pagination.pageIndex + 1 === 1 ? 'bg-primary hover:bg-primary-700 text-white' : 'hover:bg-[#C6D6EA]'} rounded-full duration-200 ease-in-out size-8 flex relative items-center justify-center font-bold cursor-pointer`}
              >
                1
              </div>
              <div
                onClick={() => {
                  printerTable.setPageIndex(1);
                }}
                className={`${printerTable.getState().pagination.pageIndex + 1 === 2 ? 'bg-primary hover:bg-primary-700 text-white' : 'hover:bg-[#C6D6EA]'} rounded-full duration-200 ease-in-out size-8 flex relative items-center justify-center font-bold cursor-pointer`}
              >
                2
              </div>
              <Next
                onClick={() => {
                  if (printerTable.getState().pagination.pageIndex + 1 === 1)
                    return;
                  printerTable.nextPage();
                }}
                className={`${printerTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} rotate-180 cursor-pointer`}
              />
              <Last
                onClick={() => {
                  printerTable.lastPage();
                }}
                className={`${printerTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} rotate-180 cursor-pointer`}
              />
            </div>
          </div>
        </Section>
        <Section className="flex flex-col gap-6">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="font-bold text-[#022A93] text-[24px] items-center">
              Danh sách yêu cầu
            </div>
            {/* <Button className="font-bold" onClick={() => {}}>
              Xem toàn bộ yêu cầu
            </Button> */}
          </div>
          <div className="w-full flex flex-row h-[2.5rem] justify-between gap-4">
            <div className="flex w-full flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg">
              <Search />
              <input
                id="searchBar"
                placeholder="Tìm yêu cầu"
                className="flex size-full focus:!outline-none"
              />
            </div>
            <div className="flex w-full flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg">
              <Search />
              <input
                id="searchBar"
                placeholder="Tìm yêu cầu dựa trên người nhận"
                className="flex size-full focus:!outline-none"
              />
            </div>
            <div
              onClick={() => {}}
              className="justify-between flex min-w-[7.5rem] flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg select-none cursor-pointer"
            >
              <div>Máy in</div>
              <Rect className={`${order ? '' : ''} fill-[#374458]`} />
            </div>
            <div
              onClick={() => {}}
              className="justify-between flex min-w-[7.5rem] flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg select-none cursor-pointer"
            >
              <div>Trạng thái</div>
              <Rect className={`${order ? '' : ''} fill-[#374458]`} />
            </div>
            <div
              onClick={() => setOrder(!order)}
              className="justify-between flex min-w-[10rem] flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg select-none cursor-pointer"
            >
              {order ? <div>Lâu nhất</div> : <div>Gần đây nhất</div>}
              <Rect className={`${order ? 'rotate-180' : ''} fill-[#374458]`} />
            </div>
            <div
              onClick={() => setContent(!content)}
              className="justify-between flex min-w-[10rem] flex-row items-center px-2 gap-2 rounded-lg select-none cursor-pointer bg-primary text-white font-bold"
            >
              {content ? <div>Yêu cầu in ấn</div> : <div>Giao dịch</div>}
              <Rect className={`${content ? 'rotate-180' : ''} fill-white`} />
            </div>
          </div>
          {content && (
            <>
              <table className="">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-start px-2 py-4 bg-[#374458] text-white"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      className="border-y border-solid border-[#374458]"
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-4 px-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="relative flex flex-row gap-2 items-center self-center">
                <Last
                  onClick={() => {
                    table.firstPage();
                  }}
                  className={`${table.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} cursor-pointer`}
                />
                <Next
                  onClick={() => {
                    if (
                      transactionTable.getState().pagination.pageIndex + 1 ===
                      1
                    )
                      return;
                    table.previousPage();
                  }}
                  className={`${table.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} cursor-pointer`}
                />
                <div
                  onClick={() => {
                    table.setPageIndex(0);
                  }}
                  className={`${table.getState().pagination.pageIndex + 1 === 1 ? 'bg-primary hover:bg-primary-700 text-white' : 'hover:bg-[#C6D6EA]'} rounded-full duration-200 ease-in-out size-8 flex relative items-center justify-center font-bold cursor-pointer`}
                >
                  1
                </div>
                <div
                  onClick={() => {
                    table.setPageIndex(1);
                  }}
                  className={`${table.getState().pagination.pageIndex + 1 === 2 ? 'bg-primary hover:bg-primary-700 text-white' : 'hover:bg-[#C6D6EA]'} rounded-full duration-200 ease-in-out size-8 flex relative items-center justify-center font-bold cursor-pointer`}
                >
                  2
                </div>
                <Next
                  onClick={() => {
                    if (
                      transactionTable.getState().pagination.pageIndex + 1 ===
                      2
                    )
                      return;
                    table.nextPage();
                  }}
                  className={`${table.getState().pagination.pageIndex + 1 === 2 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} rotate-180 cursor-pointer`}
                />
                <Last
                  onClick={() => {
                    table.lastPage();
                  }}
                  className={`${table.getState().pagination.pageIndex + 1 === 2 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} rotate-180 cursor-pointer`}
                />
              </div>
            </>
          )}
          {!content && (
            <>
              <table className="">
                <thead>
                  {transactionTable.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-start px-2 py-4 bg-[#374458] text-white"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {transactionTable.getRowModel().rows.map((row) => (
                    <tr
                      className="border-y border-solid border-[#374458]"
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-4 px-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="relative flex flex-row gap-2 items-center self-center">
                <Last
                  onClick={() => {
                    transactionTable.firstPage();
                  }}
                  className={`${transactionTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} cursor-pointer`}
                />
                <Next
                  onClick={() => {
                    if (
                      transactionTable.getState().pagination.pageIndex + 1 ===
                      1
                    )
                      return;
                    transactionTable.previousPage();
                  }}
                  className={`${transactionTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} cursor-pointer`}
                />
                <div
                  onClick={() => {
                    transactionTable.setPageIndex(0);
                  }}
                  className={`${transactionTable.getState().pagination.pageIndex + 1 === 1 ? 'bg-primary hover:bg-primary-700 text-white' : 'hover:bg-[#C6D6EA]'} rounded-full duration-200 ease-in-out size-8 flex relative items-center justify-center font-bold cursor-pointer`}
                >
                  1
                </div>
                {/* <div
                  onClick={() => {
                    transactionTable.setPageIndex(1);
                  }}
                  className={`${transactionTable.getState().pagination.pageIndex + 1 === 2 ? 'bg-primary hover:bg-primary-700 text-white' : 'hover:bg-[#C6D6EA]'} rounded-full duration-200 ease-in-out size-8 flex relative items-center justify-center font-bold cursor-pointer`}
                >
                  2
                </div> */}
                <Next
                  onClick={() => {
                    if (
                      transactionTable.getState().pagination.pageIndex + 1 ===
                      1
                    )
                      return;
                    transactionTable.nextPage();
                  }}
                  className={`${transactionTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} rotate-180 cursor-pointer`}
                />
                <Last
                  onClick={() => {
                    transactionTable.lastPage();
                  }}
                  className={`${transactionTable.getState().pagination.pageIndex + 1 === 1 ? 'stroke-[#92ABCF]' : 'stroke-[#374458]'} rotate-180 cursor-pointer`}
                />
              </div>
            </>
          )}
        </Section>
      </div>
      <Footer />
    </>
  );
}
