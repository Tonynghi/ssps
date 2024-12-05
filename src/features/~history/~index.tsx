import Rect from '@/components/icons/rect';
import Search from '@/components/icons/search';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import { requests } from '@/data/requests';
import { dateFormatter } from '@/helpers/dateFormatter';
import { PrintRequest, RequestStatus, Transaction } from '@/types';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { transactions } from '@/data/transactions';

export const Route = createFileRoute('/history/')({
  component: History,
});

function History() {
  const [order, setOrder] = useState(false);
  const [content, setContent] = useState(true);
  const [requestList, setRequestList] = useState(requests);
  const columnHelper = createColumnHelper<PrintRequest>();
  const transactionColumnHelper = createColumnHelper<Transaction>();

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

  const table = useReactTable<PrintRequest>({
    data: requestList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const transactionTable = useReactTable<Transaction>({
    data: transactions,
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        <Section className="flex flex-col gap-6">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="font-bold text-[#022A93] text-[24px] items-center">
              Lịch sử
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
                className="flex size-full focus:!outline-none"
              />
            </div>
            <div
              onClick={() => setContent(!content)}
              className="justify-between flex w-[12.5rem] flex-row items-center px-2 gap-2 rounded-lg select-none cursor-pointer bg-primary text-white font-bold"
            >
              {content ? <div>Yêu cầu in ấn</div> : <div>Giao dịch</div>}
              <Rect className={`${content ? 'rotate-180' : ''} fill-white`} />
            </div>
            <div
              onClick={() => setOrder(!order)}
              className="justify-between flex w-[12.5rem] flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg select-none cursor-pointer"
            >
              {order ? <div>Lâu nhất</div> : <div>Gần đây nhất</div>}
              <Rect className={`${order ? 'rotate-180' : ''} fill-[#374458]`} />
            </div>
          </div>
          {content && (
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
          )}
          {!content && (
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
          )}
        </Section>
      </div>
      <Footer />
    </>
  );
}
