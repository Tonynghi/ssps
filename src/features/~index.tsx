import { createFileRoute, Link } from '@tanstack/react-router';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import Printer from '@/components/icons/printer';
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
import { PrintInfo } from '@/types';
import { papers } from '@/data/papers';
import { printers } from '@/data/printers';
import ModalWrapper from '@/components/ui/modal/modal-wrapper';

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
                    <Printer className="size-20" />
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
                        type="numbers"
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
                                type="numbers"
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
                              type="numbers"
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
                                <PageSizeA4 />
                              ) : (
                                <PageSizeA3 />
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
                              <Printer className="size-20" />
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
                  <button
                    type="button"
                    className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
                  >
                    Xem chi tiết yêu cầu
                  </button>
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
            <Button className="" onClick={() => {}}>
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
        </Section>
      </div>
      <Footer />
    </>
  );
}
