import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import Section from '@/components/ui/section-wrapper';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { Document, Page } from 'react-pdf';
import { useCallback, useEffect, useState } from 'react';
import Rect from '@/components/icons/rect';
import Paper from '@/components/icons/paper';
import { PrintInfo } from '@/types';
import { printers } from '@/data/printers';
import { papers } from '@/data/papers';
import { toast } from 'react-toastify';
import axios from 'axios';
import { dateFormatter } from '@/helpers/dateFormatter';
import Profile from '@/components/icons/profile';

export const Route = createFileRoute('/request/')({
  component: Request,
});

function Request() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [printInfo, setPrintInfo] = useState<PrintInfo>({
    name: `In A1-ComputerNetwork.pdf (${32} trang,  ${2} mặt, khổ A4, ${10} bản)`,
    faces: 2,
    copies: 2,
    rangeStart: 1,
    rangeEnd: 32,
    paper: papers[0],
    printer: printers[0],
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const prevPage = () => {
    if (pageNumber <= 1) return;

    setPageNumber(pageNumber - 1);
  };

  const nextPage = () => {
    if (pageNumber >= numPages) return;

    setPageNumber(pageNumber + 1);
  };

  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        <Section className="flex gap-6">
          <div className="relative flex font-bold text-primary text-[40px]">
            Thông tin yêu cầu
          </div>
          <div className="flex flex-row justify-between">
            <div className="relative w-[25rem] flex flex-col gap-4">
              <div className="relative flex font-bold text-primary text-[24px]">
                Bản xem trước
              </div>
              <div className="w-[25rem] h-[30rem] bg-[#374458] gap-6 flex items-center justify-center relative flex-col">
                <Document
                  file="/A1-ComputerNetwork.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page height={400} pageNumber={pageNumber} />
                </Document>
                <div className="text-white flex flex-row gap-2 items-center">
                  <Rect
                    onClick={prevPage}
                    className={`${pageNumber <= 1 ? 'fill-[#ffffff80] cursor-default' : 'fill-white cursor-pointer'} rotate-90 size-3 relative`}
                  />
                  <div>
                    {pageNumber} / {numPages}
                  </div>
                  <Rect
                    onClick={nextPage}
                    className={`${pageNumber >= numPages ? 'fill-[#ffffff80] cursor-default' : 'fill-white cursor-pointer'} -rotate-90 fill-white cursor-pointer size-3 relative`}
                  />
                </div>
              </div>
              <div className="relative w-full rounded-lg border border-solid border-[#022A93] p-3 flex flex-row justify-between items-center">
                <div className="relative flex flex-row gap-2">
                  <Paper className="size-12" />
                  <div className="relative flex flex-col justify-between">
                    <div className="text-[#92ABCF]">
                      Portable Document Format
                    </div>
                    <div className="truncate relative max-w-[12.5rem]">
                      A1-ComputerNetwork.pdf
                    </div>
                  </div>
                </div>
                {/* <Button onClick={open}>Thay đổi tệp</Button> */}
              </div>
            </div>
            <div className="relative flex flex-col gap-4 w-[50rem] h-[35.5rem]">
              <div className="relative flex font-bold text-primary text-[24px]">
                Thông tin
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Tên yêu cầu:</div>
                <div>{printInfo?.name}</div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Số mặt mỗi tờ:</div>
                <div>
                  <span className="font-bold">{printInfo?.faces}</span> mặt
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Số bản in:</div>
                <div>
                  <span className="font-bold">{printInfo?.copies}</span> bản
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Tùy chọn khoảng in:</div>
                <div>
                  từ trang{' '}
                  <span className="font-bold">{printInfo?.rangeStart}</span> đến
                  trang <span className="font-bold">{printInfo?.rangeEnd}</span>
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Kích cỡ:</div>
                <div>
                  {' '}
                  <span className="font-bold">{printInfo?.paper.name}</span> (
                  {printInfo?.paper.width}mm x {printInfo?.paper.height}mm)
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Máy in:</div>
                <div>
                  <span className="font-bold">{printInfo?.printer.name}</span>{' '}
                  (Phòng {printInfo?.printer.room} Tòa{' '}
                  {printInfo?.printer.block})
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Số lượng giấy hiện có:</div>
                <div>
                  <span className="font-bold">100</span> tờ (
                  {printInfo?.paper.name})
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Số lượng giấy yêu cầu:</div>
                <div>
                  <span className="font-bold">
                    {((printInfo?.copies || 1) * numPages) /
                      (printInfo?.faces || 2)}
                  </span>{' '}
                  tờ ({printInfo?.paper.name})
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">
                  Số lượng giấy còn lại sau giao dịch:
                </div>
                <div>
                  <span className="font-bold text-green">
                    {100 -
                      ((printInfo?.copies || 1) * numPages) /
                        (printInfo?.faces || 2)}
                  </span>{' '}
                  tờ ({printInfo?.paper.name})
                </div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Thời gian:</div>
                <div>{dateFormatter(1733366453000)}</div>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Trạng thái:</div>
                <span className="rounded-lg py-1 px-4 font-bold text-white bg-green">
                  Hoàn thành
                </span>
              </div>
              <div className="flex relative flex-row justify-between w-full">
                <div className="font-bold">Người yêu cầu:</div>
                <div className="relative flex flex-row gap-4 items-center cursor-pointer">
                  <Profile className="size-6" />
                  <div>
                    Nguyễn Văn A - <span className="font-bold">2252000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
