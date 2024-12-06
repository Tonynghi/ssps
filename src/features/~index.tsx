import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/Animation - 1733389291585.json';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import PrinterIcon from '@/components/icons/printer';
import { Button } from '@/components/ui/button';
import Search from '@/components/icons/search';
import Rect from '@/components/icons/rect';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { acceptedTypes } from '@/data/accepted-types';
import Check from '@/components/icons/check';
import Paper from '@/components/icons/paper';
import { Document, Page } from 'react-pdf';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PageSizeA4 from '@/components/icons/page-size-a4';
import PageSizeA3 from '@/components/icons/page-size-a3';
import { Printer, PrintInfo, PrintRequest, RequestStatus } from '@/types';
import { papers } from '@/data/papers';
import { printers } from '@/data/printers';
import ModalWrapper from '@/components/ui/modal/modal-wrapper';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { requests } from '@/data/requests';
import { dateFormatter } from '@/helpers/dateFormatter';
import Market from '@/components/icons/market';
import Arrow from '@/components/icons/arrow';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [step, setStep] = useState(0);
  const [orderDropdown, setOrderDropdown] = useState(false);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [sizeOption, setSizeOption] = useState<string>('A4');
  const [printerOption, setPrinterOption] = useState<number>(1);
  const [printInfo, setPrintInfo] = useState<null | PrintInfo>(null);
  const [requestModal, setRequestModal] = useState(false);
  const [paperModal, setPaperModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [a4Count, setA4Count] = useState(0);
  const [a3Count, setA3Count] = useState(0);
  const [requestList, setRequestList] = useState(
    requests.filter((request) => request.status === RequestStatus.PENDING),
  );

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(
          `Tệp có định dạng ${file.type} không được hỗ trợ! Vui lòng tải tệp có định dạng .pdf`,
        );
        return;
      }

      setActiveFile(acceptedFiles.at(-1) || null);

      setStep(1);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  const formik = useFormik({
    initialValues: {
      face: 1,
      copy: 1,
      rangeStart: 1,
      custom: 'default',
      rangeEnd: numPages,
    },
    validationSchema: Yup.object({
      face: Yup.number().required('Xin nhập số mặt mỗi tờ'),
      copy: Yup.number().required('Xin nhập số bản in'),
      custom: Yup.string()
        .oneOf(['default', 'custom'])
        .required('Xin nhập tùy chọn thiếp lập khoảng in'),
      rangeStart: Yup.number().when('custom', {
        is: 'custom',
        then: (schema) =>
          schema
            .min(1)
            .max(numPages)
            .lessThan(Yup.ref('rangeEnd'))
            .required('Xin nhập trang khởi điểm'),
        otherwise: (schema) => schema.optional(),
      }),
      rangeEnd: Yup.number().when('custom', {
        is: 'custom',
        then: (schema) =>
          schema
            .min(1)
            .max(numPages)
            .moreThan(Yup.ref('rangeStart'))
            .required('Xin nhập trang kết thúc'),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    onSubmit: (value) => {
      const pages =
        value.custom === 'custom'
          ? value.rangeEnd - value.rangeStart + 1
          : numPages;

      setPrintInfo({
        name: `In ${activeFile?.name} (${pages} trang,  ${value.face} mặt, khổ ${sizeOption}, ${value.copy} bản)`,
        faces: value.face,
        copies: value.copy,
        rangeStart: value.custom === 'custom' ? value.rangeStart : 1,
        rangeEnd: value.custom === 'custom' ? value.rangeEnd : numPages,
        paper: sizeOption === 'A4' ? papers[0] : papers[1],
        printer: printers[printerOption],
      });

      setStep(2);
    },
  });

  const columnHelper = createColumnHelper<PrintRequest>();

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

  const table = useReactTable<PrintRequest>({
    data: requestList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <ModalWrapper
        show={transactionModal}
        close={() => setTransactionModal(false)}
      >
        <div className="relative flex flex-col bg-white p-6 rounded-lg w-[40rem]">
          <div className="font-bold text-primary text-[24px]">
            Hóa đơn giao dịch đã được xử lý!
          </div>
          <div className="mt-6">
            Hóa đơn giao dịch của bạn đã được gửi!, vui lòng truy cập{' '}
            <span className="font-bold">BKPay</span> và thực hiện thanh toán để
            nhận sản phẩm.
          </div>
          <div className="relative flex flex-row gap-4 self-end mt-10">
            <button
              type="button"
              onClick={() => setTransactionModal(false)}
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg border-primary border border-solid px-12 py-2 font-bold text-primary duration-200 ease-in-out hover:bg-primary hover:text-white self-end"
            >
              Quay lại
            </button>
          </div>
        </div>
      </ModalWrapper>
      <ModalWrapper show={paperModal} close={() => setPaperModal(false)}>
        <div className="relative flex flex-col bg-white p-6 rounded-lg w-[40rem]">
          <div className="font-bold text-primary text-[24px]">
            Xác nhận giao dịch
          </div>
          <div className="mt-6">
            Một khi giao dịch đã được xác nhận, bạn sẽ không thể hoàn tác. Hóa
            đơn giao dịch và thanh toán sẽ được thực hiện qua{' '}
            <span className="font-bold">BKPay</span>
            !
            <br /> Xác nhận thanh toán{' '}
            <span className="font-bold">
              {(a3Count * 1000 + a4Count * 500).toLocaleString()} VNĐ
            </span>{' '}
            cho <span className="font-bold">Giấy A4 x {a4Count}</span>,{' '}
            <span className="font-bold">Giấy A3 x {a3Count}</span>?
          </div>
          <div className="relative flex flex-row gap-4 self-end mt-10">
            <button
              type="button"
              onClick={() => setPaperModal(false)}
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg border-primary border border-solid px-12 py-2 font-bold text-primary duration-200 ease-in-out hover:bg-primary hover:text-white self-end"
            >
              Từ chối
            </button>
            <button
              type="button"
              onClick={() => {
                setPaperModal(false);
                setTransactionModal(true);
              }}
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </ModalWrapper>
      <ModalWrapper show={requestModal} close={() => setRequestModal(false)}>
        <div className="relative flex flex-col bg-white p-6 rounded-lg w-[40rem]">
          <div className="font-bold text-primary text-[24px]">
            Xác nhận gửi yêu cầu in ấn
          </div>
          <div className="mt-6">
            Một khi giao dịch đã được xác nhận, bạn sẽ không thể hoàn tác.
            <br /> Xác nhận gửi yêu cầu?
          </div>
          <div className="relative flex flex-row gap-4 self-end mt-10">
            <button
              type="button"
              onClick={() => setRequestModal(false)}
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg border-primary border border-solid px-12 py-2 font-bold text-primary duration-200 ease-in-out hover:bg-primary hover:text-white self-end"
            >
              Từ chối
            </button>
            <button
              type="button"
              onClick={() => {
                setRequestModal(false);
                setStep(3);
                setTimeout(() => {
                  setStep(4);
                }, 2500);
              }}
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </ModalWrapper>
      <div className="relative flex flex-col">
        <Header />
        <Section className="bg-[#022A93] gap-6">
          <div className="font-bold text-white text-[32px]">
            Chào mừng đến Dịch vụ In ấn thông minh Bách Khoa!
          </div>
          <div className="w-full bg-white rounded-2xl p-6 gap-6 flex flex-col">
            <div className="flex relative flex-row justify-between items-center">
              <div className="font-bold text-[24px] text-[#022A93] min-w-36">
                In ấn ngay
              </div>
              {step === 0 ? (
                <div className="h-6 w-full bg-[#022A93]" />
              ) : (
                <div className="flex flex-row gap-3 items-center absolute w-full justify-center">
                  <div className="relative flex flex-row h-6 gap-2">
                    <div
                      className={`${step > 1 ? 'bg-[#022A93]' : 'bg-[#374458]'} relative rounded-full text-white flex items-center justify-center size-6`}
                    >
                      {step > 1 ? <Check className="fill-white size-4" /> : 1}
                    </div>
                    Cài đặt thông số
                  </div>
                  <div
                    className={`${step > 1 ? 'bg-[#022A93]' : 'bg-[#92ABCF]'} h-[1px] w-10 relative`}
                  />
                  <div
                    className={`${step > 2 ? 'text-[#022A93]' : step < 2 ? 'text-[#92ABCF] ' : 'text-[#374458]'} relative flex flex-row h-6 gap-2`}
                  >
                    <div
                      className={`${step > 2 ? 'bg-[#022A93] text-white' : step < 2 ? 'text-[#92ABCF] bg-transparent border border-[#92ABCF] border-solid' : 'bg-[#374458] text-white'} relative rounded-full flex items-center justify-center size-6`}
                    >
                      {step > 2 ? <Check className="fill-white size-4" /> : 2}
                    </div>
                    Xác nhận thông tin
                  </div>
                  <div
                    className={`${step > 2 ? 'bg-[#022A93]' : 'bg-[#92ABCF]'} h-[1px] w-10 relative`}
                  />
                  <div
                    className={`${step > 3 ? 'text-[#022A93]' : step < 2 ? 'text-[#92ABCF] ' : 'text-[#374458]'} relative flex flex-row h-6 gap-2`}
                  >
                    <div
                      className={`${step > 3 ? 'bg-[#022A93] text-white' : step < 3 ? 'text-[#92ABCF] bg-transparent border border-[#92ABCF] border-solid' : 'bg-[#374458] text-white'} relative rounded-ful flex items-center justify-center size-6 rounded-full`}
                    >
                      {step > 3 ? <Check className="fill-white size-4" /> : 3}
                    </div>
                    Chờ xử lý
                  </div>
                </div>
              )}
            </div>
            {step === 0 && (
              <div
                {...getRootProps()}
                className="flex flex-col w-full relative rounded-2xl border-dashed border-2 border-[#022A93] h-[25rem] items-center justify-center gap-2"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    Thả để tải tệp lên
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PrinterIcon className="size-20" />
                    <div className="text-tertiary">
                      Kéo tệp và thả vào để tải lên
                    </div>
                    <div className="text-tertiary-300">
                      Hệ thống chỉ nhận tệp có định dạng .pdf
                    </div>
                    <Button className="mt-2" onClick={open}>
                      Chọn tệp và in ngay
                    </Button>
                  </div>
                )}
              </div>
            )}
            {step === 1 && (
              <div className="relative flex flex-row w-full justify-between">
                <div className="relative flex flex-col gap-4">
                  <div className="w-[25rem] h-[30rem] bg-[#374458] gap-6 flex items-center justify-center relative flex-col">
                    <Document
                      file={activeFile}
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
                  <div
                    {...getRootProps()}
                    className="relative w-full rounded-lg border border-solid border-[#022A93] p-3 flex flex-row justify-between items-center"
                  >
                    <input {...getInputProps()} />
                    <div className="relative flex flex-row gap-2">
                      <Paper className="size-12" />
                      <div className="relative flex flex-col justify-between">
                        <div className="text-[#92ABCF]">
                          {activeFile?.type === 'application/pdf'
                            ? 'Portable Document Format'
                            : 'Microsoft Word Document'}
                        </div>
                        <div className="truncate relative max-w-[12.5rem]">
                          {activeFile?.name}
                        </div>
                      </div>
                    </div>
                    <Button onClick={open}>Thay đổi tệp</Button>
                  </div>
                </div>
                <form
                  onSubmit={formik.handleSubmit}
                  className="relative flex flex-col gap-4"
                >
                  <div className="relative flex w-full flex-row gap-2 items-center justify-between">
                    <label htmlFor="face" className="relative font-bold">
                      Số mặt mỗi tờ:
                    </label>
                    <div className="relative flex flex-col items-center justify-start gap-2 lg:items-start">
                      <select
                        id="face"
                        name="face"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.face}
                        className={`${formik.touched.face && formik.errors.face ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[10rem]`}
                      >
                        <option value={1}>1 mặt</option>
                        <option value={2}>2 mặt</option>
                      </select>
                      {formik.touched.face && formik.errors.face ? (
                        <div className="flex text-red">
                          {formik.errors.face}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="relative flex w-full flex-row gap-2 items-center justify-between">
                    <label htmlFor="copy" className="relative font-bold">
                      Số bản in:
                    </label>
                    <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                      <input
                        id="copy"
                        name="copy"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.copy}
                        className={`${formik.touched.copy && formik.errors.copy ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[10rem] self-end`}
                      />
                      <div className="absolute text-[#92ABCF] mt-1 mr-4 top-0 right-0">
                        bản
                      </div>
                      {formik.touched.copy && formik.errors.copy ? (
                        <div className="flex text-red">
                          {formik.errors.copy}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="relative flex w-full flex-row gap-2 items-center justify-between">
                    <label className="relative font-bold">
                      Tùy chọn khoảng in:
                    </label>
                    <div className="relative flex flex-row items-center justify-end gap-2">
                      <div className="relative flex flex-col gap-2">
                        <fieldset
                          role="group"
                          aria-labelledby="rangeGroup"
                          className="relative flex flex-row gap-5"
                        >
                          <div className="flex flex-row gap-2">
                            <input
                              id="custom"
                              name="custom"
                              type="radio"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value="default"
                              className="accent-[#374458] size-5"
                            />
                            <div>Mặc định</div>
                          </div>
                          <div className="flex flex-row gap-2">
                            <input
                              id="custom"
                              name="custom"
                              type="radio"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value="custom"
                              className="accent-[#374458] size-5"
                            />
                            <div>Tùy chọn:</div>
                          </div>
                        </fieldset>
                        {formik.touched.custom && formik.errors.custom ? (
                          <div className="flex text-red">
                            {formik.errors.custom}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex relative flex-col gap-2">
                        <div
                          className={`${formik.values.custom === 'default' ? 'opacity-50' : ''} flex flex-row gap-2`}
                        >
                          <div className="relative flex flex-row items-center gap-2">
                            <label htmlFor="rangeStart" className="relative">
                              từ trang:
                            </label>
                            <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                              <input
                                disabled={formik.values.custom === 'default'}
                                id="rangeStart"
                                name="rangeStart"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rangeStart}
                                className={`${formik.touched.rangeStart && formik.errors.rangeStart ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-2 focus:border-primary w-[2.5rem] self-end`}
                              />
                            </div>
                          </div>
                          <div className="relative flex flex-row items-center gap-2">
                            <label htmlFor="rangeEnd" className="relative">
                              đến trang:
                            </label>
                            <input
                              disabled={formik.values.custom === 'default'}
                              id="rangeEnd"
                              name="rangeEnd"
                              type="number"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.rangeEnd}
                              className={`${formik.touched.rangeEnd && formik.errors.rangeEnd ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-2 focus:border-primary w-[2.5rem] self-end`}
                            />
                          </div>
                        </div>
                        {/* {formik.touched.rangeStart &&
                        formik.errors.rangeStart ? (
                          <div className="flex text-red">
                            {formik.errors.rangeStart}
                          </div>
                        ) : null}
                        {formik.touched.rangeEnd && formik.errors.rangeEnd ? (
                          <div className="flex text-red">
                            {formik.errors.rangeEnd}
                          </div>
                        ) : null} */}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between gap-4 w-full">
                    <div className="flex flex-col gap-2 relative">
                      <div className="relative font-bold">Kích cỡ</div>
                      <div className="grid relative grid-cols-2 gap-2">
                        {papers.map((paper) => {
                          return (
                            <div
                              key={paper.name}
                              onClick={() => setSizeOption(paper.name)}
                              className={`${sizeOption === paper.name ? 'border-2 border-[#022A93]' : 'border border-[#92ABCF]'} border-solid flex flex-col items-center justify-between p-3 rounded-lg shadow-xl cursor-pointer`}
                            >
                              {paper.name === 'A4' ? (
                                <PageSizeA4 className="h-20" />
                              ) : (
                                <PageSizeA3 className="h-20" />
                              )}
                              <div className="font-bold">{paper.name}</div>
                              <div className="text-[#92ABCF]">
                                {paper.width}mm x {paper.height}mm
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                      <div className="relative font-bold">Máy in</div>
                      <div className="grid relative grid-cols-3 gap-2">
                        {printers.map((printer, index) => {
                          return (
                            <div
                              key={printer.id}
                              onClick={() => {
                                if (!printer.disabled) setPrinterOption(index);
                              }}
                              className={`${printerOption === index ? 'border-2 border-[#022A93]' : 'border border-[#92ABCF]'} border-solid flex flex-col items-center justify-between p-3 rounded-lg shadow-xl ${printer.disabled ? 'cursor-default' : 'cursor-pointer'} relative`}
                            >
                              {printer.disabled && (
                                <div className="font-bold text-white size-full bg-[#37445880] absolute top-0 rounded-lg flex items-center justify-center">
                                  KHÔNG KHẢ DỤNG
                                </div>
                              )}
                              <PrinterIcon className="size-20" />
                              <div className="font-bold">{printer.name}</div>
                              <div className="text-[#92ABCF]">
                                Phòng {printer.room} Tòa {printer.block}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-2 flex flex-row gap-4 self-end">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFile(null);
                        setStep(0);
                      }}
                      className="relative mt-2 flex size-fit items-center justify-center rounded-lg border-primary border border-solid px-12 py-2 font-bold text-primary duration-200 ease-in-out hover:bg-primary hover:text-white self-end"
                    >
                      Huỷ bỏ
                    </button>
                    <button
                      type="submit"
                      className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
                    >
                      Xác nhận thông tin
                    </button>
                  </div>
                </form>
              </div>
            )}
            {step === 2 && (
              <div className="relative flex flex-row w-full justify-between">
                <div className="relative flex flex-col gap-4">
                  <div className="w-[25rem] h-[30rem] bg-[#374458] gap-6 flex items-center justify-center relative flex-col">
                    <Document
                      file={activeFile}
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
                          {activeFile?.type === 'application/pdf'
                            ? 'Portable Document Format'
                            : 'Microsoft Word Document'}
                        </div>
                        <div className="truncate relative max-w-[12.5rem]">
                          {activeFile?.name}
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
                      <span className="font-bold">{printInfo?.rangeStart}</span>{' '}
                      đến trang{' '}
                      <span className="font-bold">{printInfo?.rangeEnd}</span>
                    </div>
                  </div>
                  <div className="flex relative flex-row justify-between w-full">
                    <div className="font-bold">Kích cỡ:</div>
                    <div>
                      {' '}
                      <span className="font-bold">
                        {printInfo?.paper.name}
                      </span>{' '}
                      ({printInfo?.paper.width}mm x {printInfo?.paper.height}mm)
                    </div>
                  </div>
                  <div className="flex relative flex-row justify-between w-full">
                    <div className="font-bold">Máy in:</div>
                    <div>
                      <span className="font-bold">
                        {printInfo?.printer.name}
                      </span>{' '}
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
                  <div className="absolute mt-2 flex flex-row gap-4 self-end bottom-0">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                      }}
                      className="relative mt-2 flex size-fit items-center justify-center rounded-lg border-primary border border-solid px-12 py-2 font-bold text-primary duration-200 ease-in-out hover:bg-primary hover:text-white self-end"
                    >
                      Quay lại
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestModal(true)}
                      className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
                    >
                      Gửi yêu cầu
                    </button>
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="relative flex flex-col w-full justify-center items-center py-20">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-28"
                >
                  <path
                    d="M97.1648 141.347C97.0835 141.347 96.9721 141.327 96.8712 141.215L96.9018 140.679L107.471 131.201H89.0463C89.0514 131.045 89.0567 130.534 89.0514 130.433H107.375L96.9824 120.925L96.9518 120.394L97.5129 120.364L108.674 130.565L108.679 131.126L97.4172 141.246L97.1648 141.347ZM75.5299 136.074C72.5878 136.074 70.1918 133.678 70.1918 130.737C70.1918 127.795 72.5878 125.399 75.5299 125.399C78.4669 125.399 80.8578 127.795 80.8578 130.737C80.8578 133.678 78.4669 136.074 75.5299 136.074ZM54.0467 141.529C53.9504 141.529 53.8696 141.493 53.7987 141.433L42.289 131.086L42.2941 130.514L53.708 120.233L54.2536 120.288L54.2133 120.809L43.5426 130.433H61.9978C61.9927 130.534 61.9978 131.045 62.0029 131.201H43.568L54.3097 140.851L54.3345 141.397L54.0467 141.529ZM75.1252 109.213L25.6891 109.183C21.1698 109.041 17.5708 105.341 17.5708 100.751V26.829C17.5708 22.1632 21.3619 18.3669 26.0225 18.3669H57.0294C62.4432 18.3669 66.684 21.8246 69.7826 24.3522C72.0269 26.1819 73.6549 27.5061 75.5601 27.5061H104.586C109.251 27.5061 113.047 31.2972 113.047 35.9578V40.2546H133.762C136.502 40.2546 139.332 41.5434 140.98 43.5456C141.789 44.5259 142.669 46.1336 142.264 48.2108L132.645 100.281C131.932 104.421 129.288 109.213 124.147 109.213H75.8939V117.205C75.7723 117.2 75.2618 117.2 75.1252 117.205V109.213Z"
                    fill="white"
                  />
                  <path
                    d="M99.2573 118.453C98.044 117.351 96.1636 117.432 95.0517 118.635C94.5356 119.211 94.2732 119.929 94.2732 120.637C94.2732 121.446 94.5967 122.245 95.2438 122.841C95.2438 122.841 98.0338 125.378 100.723 127.846H86.0338C86.2864 128.776 86.4687 129.736 86.4687 130.737C86.4687 131.808 86.2663 132.809 85.9831 133.79H100.703C98.8583 135.443 97.0149 137.098 95.1728 138.754C94.8644 139.032 94.6177 139.372 94.4488 139.752C94.2799 140.131 94.1924 140.542 94.1919 140.958C94.1901 141.693 94.4602 142.402 94.9503 142.95C96.0522 144.173 97.9328 144.274 99.1461 143.172L110.408 133.052C111.025 132.496 111.379 131.697 111.389 130.858C111.388 130.443 111.302 130.033 111.135 129.654C110.968 129.275 110.724 128.934 110.418 128.654L99.2573 118.453ZM75.5297 122.811C71.1621 122.811 67.6034 126.369 67.6034 130.737C67.6034 135.104 71.1621 138.663 75.5297 138.663C79.887 138.663 83.4456 135.104 83.4456 130.737C83.4456 126.369 79.887 122.811 75.5297 122.811ZM64.5805 130.737C64.5805 129.736 64.7628 128.776 65.0154 127.845H50.2757C53.0559 125.338 55.9473 122.73 55.9473 122.73C56.2588 122.453 56.5081 122.114 56.6789 121.734C56.8497 121.354 56.938 120.942 56.938 120.526C56.938 119.818 56.685 119.111 56.1693 118.544C55.0776 117.321 53.1972 117.22 51.974 118.312L40.56 128.593C40.2513 128.871 40.0045 129.211 39.8356 129.591C39.6667 129.971 39.5795 130.382 39.5797 130.797C39.5797 131.647 39.9332 132.446 40.56 133.011L52.0652 143.354C53.2882 144.456 55.1688 144.344 56.2605 143.131C56.7557 142.59 57.03 141.883 57.0292 141.15C57.0292 140.331 56.6954 139.522 56.038 138.926C56.038 138.926 53.1166 136.307 50.3162 133.79H65.0663C64.7829 132.809 64.5805 131.808 64.5805 130.737ZM133.762 37.6665H115.635V35.9579C115.635 29.8724 110.691 24.9182 104.585 24.9182H75.5598C72.7393 24.9182 66.7749 15.7791 57.0291 15.7791H26.0221C19.9359 15.7791 14.9824 20.7326 14.9824 26.8292V100.751C14.9824 106.726 19.7544 111.589 25.6889 111.771C25.7495 111.771 25.7996 111.801 25.8706 111.801H72.5369V120.253C73.4976 119.98 74.4884 119.788 75.5299 119.788C76.561 119.788 77.5413 119.98 78.4819 120.253V111.801H124.147C130.233 111.801 134.166 106.716 135.187 100.751L144.802 48.7064C146.004 42.5596 139.848 37.6665 133.762 37.6665Z"
                    fill="#374458"
                  />
                  <path
                    d="M27.2451 104.037H26.0221C24.2125 104.037 22.7466 102.561 22.7466 100.751V26.8291C22.7466 25.0195 24.2125 23.5432 26.0221 23.5432H57.029C60.5974 23.5432 63.7415 26.1007 66.5118 28.3654C69.1201 30.4887 71.8091 32.6823 75.5597 32.6823H104.585C106.395 32.6823 107.87 34.1483 107.87 35.9578V37.6664H92.4837C86.721 37.6664 81.767 45.5016 79.6241 45.5016H49.0219C42.9253 45.5016 39.1043 50.4655 37.9618 56.5517L28.6707 101.226C28.4584 102.328 28.0439 103.4 27.2451 104.037Z"
                    fill="#022A93"
                  />
                  <path
                    d="M127.534 99.4368C127.504 99.6288 126.715 104.037 124.147 104.037H35.8188C35.9504 103.592 36.1729 103.289 36.2738 102.803L45.595 57.987C45.7467 57.1986 46.606 53.2658 49.0222 53.2658H79.6242C83.4757 53.2658 85.9935 50.9406 88.4299 48.686C89.4911 47.7056 91.6748 45.6833 92.6557 45.4307H133.762C135.632 45.4307 137.098 46.7248 137.169 47.3009L127.534 99.4368Z"
                    fill="#1488DB"
                  />
                  <path
                    d="M122.631 61.6367H92.9995C91.2708 61.6367 89.8653 63.0318 89.8653 64.7605C89.8653 66.4893 91.2706 67.8947 92.9995 67.8947H122.631C124.35 67.8947 125.744 66.4895 125.744 64.7605C125.745 63.0318 124.35 61.6367 122.631 61.6367ZM119.841 75.4464H90.2195C88.4907 75.4464 87.0952 76.8517 87.0952 78.5806C87.0952 80.3093 88.4907 81.7044 90.2195 81.7044H119.841C121.559 81.7044 122.964 80.3093 122.964 78.5806C122.964 76.8517 121.559 75.4464 119.841 75.4464Z"
                    fill="#374458"
                  />
                  <path
                    d="M75.5597 32.6823C71.8091 32.6823 69.12 30.4887 66.5118 28.3654C63.7415 26.1008 60.5974 23.5432 57.029 23.5432H26.0221C24.2125 23.5432 22.7466 25.0195 22.7466 26.8291V32.6823H75.5597Z"
                    fill="white"
                  />
                </svg>
                <div className="mt-10 text-center">
                  Yêu cầu của bạn đang được xử lý ...
                  <br />
                  Vui lòng chờ trong giây lát
                </div>
                <div className="relative flex flex-row gap-4 mt-6">
                  <Lottie animationData={loadingAnimation} loop={true} />
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="relative flex flex-col w-full justify-center items-center py-20">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-32"
                >
                  <path
                    d="M120 26.6667V106.667C120 110.203 118.595 113.594 116.094 116.095C113.594 118.595 110.203 120 106.666 120H26.6663C23.1301 120 19.7387 118.595 17.2383 116.095C14.7378 113.594 13.333 110.203 13.333 106.667V26.6667C13.333 23.1305 14.7378 19.7391 17.2383 17.2386C19.7387 14.7381 23.1301 13.3333 26.6663 13.3333H106.666C110.203 13.3333 113.594 14.7381 116.094 17.2386C118.595 19.7391 120 23.1305 120 26.6667ZM146.666 133.333V33.3333C146.666 31.5652 145.964 29.8695 144.714 28.6193C143.463 27.3691 141.768 26.6667 140 26.6667C138.232 26.6667 136.536 27.3691 135.286 28.6193C134.035 29.8695 133.333 31.5652 133.333 33.3333V133.333H46.6663C44.8982 133.333 43.2025 134.036 41.9523 135.286C40.7021 136.536 39.9997 138.232 39.9997 140C39.9997 141.768 40.7021 143.464 41.9523 144.714C43.2025 145.964 44.8982 146.667 46.6663 146.667H133.333C136.869 146.667 140.261 145.262 142.761 142.761C145.262 140.261 146.666 136.87 146.666 133.333Z"
                    fill="#022A93"
                  />
                  <path
                    d="M61.6671 85.8667C60.785 85.863 59.9125 85.6844 59.1 85.341C58.2875 84.9977 57.5512 84.4966 56.9337 83.8667L41.9337 68.8667C40.6921 67.6176 39.9951 65.9279 39.9951 64.1667C39.9951 62.4054 40.6921 60.7158 41.9337 59.4667C42.5535 58.8418 43.2908 58.3459 44.1032 58.0074C44.9156 57.6689 45.787 57.4947 46.6671 57.4947C47.5471 57.4947 48.4185 57.6689 49.2309 58.0074C50.0433 58.3459 50.7806 58.8418 51.4004 59.4667L61.6671 69.7333L81.6671 49.7333C82.2868 49.1085 83.0242 48.6125 83.8366 48.2741C84.6489 47.9356 85.5203 47.7614 86.4004 47.7614C87.2805 47.7614 88.1519 47.9356 88.9642 48.2741C89.7766 48.6125 90.514 49.1085 91.1337 49.7333C92.3754 50.9824 93.0723 52.6721 93.0723 54.4333C93.0723 56.1946 92.3754 57.8843 91.1337 59.1333L66.6671 83.8667C66.0186 84.5294 65.2389 85.0496 64.378 85.394C63.5171 85.7384 62.5937 85.8994 61.6671 85.8667Z"
                    fill="white"
                  />
                </svg>
                <div className="mt-10 text-center">
                  Yêu cầu của bạn đã được gửi đi đến máy in thành công!
                  <br /> Hãy đến trực tiếp địa điểm của máy in để chờ và nhận
                  bản in
                </div>
                <div className="relative flex flex-row gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
                  >
                    Gửi yêu cầu khác
                  </button>
                  <Link
                    to="/history"
                    className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
                  >
                    Xem chi tiết yêu cầu
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Section>
        <Section className="flex flex-col gap-6">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="font-bold text-[#022A93] text-[24px] items-center">
              Yêu cầu đang được xử lý
            </div>
            <Button
              className="font-bold"
              onClick={() => {
                navigate({ to: '/history' });
              }}
            >
              Xem toàn bộ yêu cầu
            </Button>
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
              onClick={() => setOrderDropdown(!orderDropdown)}
              className="justify-between flex w-[12.5rem] flex-row items-center px-2 border-solid border-[#374458] border gap-2 rounded-lg select-none cursor-pointer"
            >
              {orderDropdown ? <div>Lâu nhất</div> : <div>Gần đây nhất</div>}
              <Rect
                className={`${orderDropdown ? 'rotate-180' : ''} fill-[#374458]`}
              />
            </div>
          </div>
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
        </Section>
        <Section className="flex relative !flex-row justify-between items-start">
          <div className="bg-red relative flex flex-col w-[40rem] h-[40rem] rounded-2xl p-6">
            <img
              alt="Buy paper background"
              src="/bg1.png"
              className="size-full object-cover absolute top-0 left-0 rounded-2xl"
            />
            <div className="relative flex flex-row justify-between w-full">
              <div className="relative flex flex-col text-white w-[20rem]">
                <div className="text-[24px] font-bold">Giấy in</div>
                <div className="mt-2">
                  Để sử dụng dịch vụ In ấn thông minh, sinh viên được yêu cầu
                  phải sở hữu đủ lượng giấy cần thiết phục vụ cho việc in ấn
                </div>
              </div>
              <Paper className="size-[7rem] relative" />
            </div>
            <div className="grid grid-cols-3 w-full relative mt-6">
              <div className="rounded-lg bg-white w-[11rem] flex flex-col relative">
                <div className="w-full flex items-center justify-center py-6 rounded-t-lg bg-[#DAE4F4] relative">
                  <PageSizeA4 className="h-20" />
                </div>
                <div className="w-full flex flex-col py-2 px-4 rounded-b-lg bg-white relative">
                  <div className="text-[#92ABCF] text-[12px]">Giấy</div>
                  <div className="font-bold">Giấy A4</div>
                  <div className="mt-6 self-end">
                    Hiện có: <span className="font-bold text-primary">10</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white w-[11rem] flex flex-col relative">
                <div className="w-full flex items-center justify-center py-6 rounded-t-lg bg-[#DAE4F4] relative">
                  <PageSizeA3 className="h-20" />
                </div>
                <div className="w-full flex flex-col py-2 px-4 rounded-b-lg bg-white relative">
                  <div className="text-[#92ABCF] text-[12px]">Giấy</div>
                  <div className="font-bold">Giấy A3</div>
                  <div className="mt-6 self-end">
                    Hiện có: <span className="font-bold text-primary">10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col w-[40rem] h-[40rem]">
            <div className="relative flex flex-row gap-4 items-center w-full">
              <Market className="size-6 relative" />
              <div className="text-[24px] font-bold">Mua thêm giấy in</div>
            </div>
            <div className="grid grid-cols-3 w-full relative mt-6">
              <div className="rounded-lg shadow-xl bg-white w-[12.5rem] flex flex-col relative">
                <div className="w-full flex items-center justify-center py-6 rounded-t-lg bg-[#DAE4F4] relative">
                  <PageSizeA4 className="h-20" />
                </div>
                <div className="w-full flex flex-col py-2 px-4 rounded-b-lg bg-white relative">
                  <div className="text-[#92ABCF] text-[12px]">Giấy</div>
                  <div className="font-bold">Giấy A4</div>
                  <div className="mt-6 w-full flex flex-row justify-between">
                    <div className="text-primary">500 VNĐ</div>
                    <div className="relative flex flex-row gap-3 items-center">
                      <Arrow
                        onClick={() => {
                          if (a4Count <= 0) return;
                          setA4Count(a4Count - 1);
                        }}
                        className="fill-[#374458] cursor-pointer"
                      />
                      <div className="w-5 flex items-center justify-center select-none">
                        {a4Count}
                      </div>
                      <Arrow
                        onClick={() => {
                          setA4Count(a4Count + 1);
                        }}
                        className="fill-[#374458] rotate-180 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg shadow-xl bg-white w-[12.5rem] flex flex-col relative">
                <div className="w-full flex items-center justify-center py-6 rounded-t-lg bg-[#DAE4F4] relative">
                  <PageSizeA3 className="h-20" />
                </div>
                <div className="w-full flex flex-col py-2 px-4 rounded-b-lg bg-white relative">
                  <div className="text-[#92ABCF] text-[12px]">Giấy</div>
                  <div className="font-bold">Giấy A3</div>
                  <div className="mt-6 w-full flex flex-row justify-between">
                    <div className="text-primary">1000 VNĐ</div>
                    <div className="relative flex flex-row gap-3 items-center">
                      <Arrow
                        onClick={() => {
                          if (a3Count <= 0) return;
                          setA3Count(a3Count - 1);
                        }}
                        className="fill-[#374458] cursor-pointer"
                      />
                      <div className="w-5 flex items-center justify-center select-none">
                        {a3Count}
                      </div>
                      <Arrow
                        onClick={() => {
                          setA3Count(a3Count + 1);
                        }}
                        className="fill-[#374458] rotate-180 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 flex flex-col items-end gap-2 self-end mt-10">
              <div className="text-primary select-none">
                Tổng:{' '}
                <span className="font-bold">
                  {(a3Count * 1000 + a4Count * 500).toLocaleString()} VNĐ
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (a4Count <= 0 && a3Count <= 0)
                    toast.error(
                      'Vui lòng nhập số lượng mong muốn trước khi giao dịch!',
                    );
                  else setPaperModal(true);
                }}
                className="relative flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
