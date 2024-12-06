import * as Yup from 'yup';
import { createFileRoute, Link } from '@tanstack/react-router';
import Header from '@/components/ui/header';
import Section from '@/components/ui/section-wrapper';
import Footer from '@/components/ui/footer';
import Printer from '@/components/icons/printer';
import Position from '@/components/icons/position';
import { printers } from '@/data/printers';
import Add from '@/components/icons/add';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/management/')({
  component: Management,
});

type PrinterCardProps = {
  name: string;
  disabled: boolean;
  description: string;
  room: number;
  block: string;
};

const PrinterCard = ({
  name,
  disabled,
  description,
  room,
  block,
}: PrinterCardProps) => {
  return (
    <Link
      to="/"
      className="w-[20rem] bg-white shadow-xl flex flex-row items-center justify-between h-[7.5rem] relative p-4"
    >
      <div className="flex flex-col h-full relative gap-2">
        <div className="flex flex-row gap-4 font-bold relative items-center">
          <div>{name}</div>
          <div
            className={` ${disabled ? 'text-red' : 'text-primary'} text-[12px]`}
          >
            {disabled ? 'Tạm ngưng' : 'Đang hoạt động'}
          </div>
        </div>
        <div className="text-[12px]">Máy in của Tòa A3</div>
        <div className="flex flex-row gap-2 absolute bottom-0 text-[#92ABCF]">
          <Position />
          <div className="text-[12px]">
            Phòng {room} Tòa {block}
          </div>
        </div>
      </div>
      <Printer className="size-[6rem]" />
    </Link>
  );
};

function Management() {
  const [customDates, setCustomDates] = useState<Array<Date>>([]);

  const addCustomDate = () => {
    const newCustomDates = [...customDates];
    newCustomDates.push(new Date(Date.now()));
    setCustomDates(newCustomDates);
  };

  const formik = useFormik({
    initialValues: {
      fileTypes: [],
      a4count: 10,
      a3count: 10,
      distribution: 'periodically',
      day: '',
      period: 6,
    },
    validationSchema: Yup.object({
      fileTypes: Yup.array()
        .min(1, 'Chọn ít nhất một định dạng')
        .required('Vui lòng chọn tối thiểu 1 định dạng'),
      a4count: Yup.number().required('Xin nhập số giấy A4 phân phát'),
      a3count: Yup.number().required('Xin nhập số giấy A3 phân phát'),
      distribution: Yup.string()
        .oneOf(['periodically', 'custom'])
        .required('Xin nhập tùy chọn thiếp lập phân phát'),
      day: Yup.number().when('distribution', {
        is: 'periodically',
        then: (schema) =>
          schema.min(1).max(30).required('Xin nhập ngày của chu kỳ'),
        otherwise: (schema) => schema.optional(),
      }),
      period: Yup.number().when('distribution', {
        is: 'periodically',
        then: (schema) =>
          schema.oneOf([1, 3, 6, 12]).required('Xin chọn chu kỳ phân phát'),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    onSubmit: (value) => {
      console.log(value);
      toast.success('Cập nhật thiết lập thành công!');
    },
  });
  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        <Section className="flex flex-col gap-6">
          <div className="flex flex-row justify-between relative w-full items-center">
            <div className="font-bold text-[24px] text-primary">
              Danh sách máy in
            </div>
            <Link
              to="/history"
              className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-4 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
            >
              <Add className="mr-2 fill-[white]" /> Cài đặt thêm máy in
            </Link>
          </div>
          <div className="grid relative w-full grid-cols-4 gap-6">
            {printers.map((printer) => {
              return (
                <PrinterCard
                  key={printer.id}
                  name={printer.name}
                  disabled={printer.disabled}
                  description={printer.description}
                  room={printer.room}
                  block={printer.block}
                />
              );
            })}
          </div>
        </Section>
        <Section className="flex flex-col gap-6">
          <div className="font-bold text-[24px] text-primary">
            Thiết lập hệ Thống
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="relative flex flex-row w-full justify-between"
          >
            <fieldset
              role="group"
              aria-labelledby="fileTypesGroup"
              className="flex relative flex-col gap-4"
            >
              <div className="font-bold">Thiết lập định dạng tệp</div>
              <div>
                Người dùng chỉ có thể tải lên các tệp và thực hiện in ấn với
                định dạng như sau:
              </div>
              <div className="flex flex-row relative gap-2">
                <input
                  value="docx"
                  id="fileTypes"
                  name="fileTypes"
                  type="checkbox"
                  className="accent-[#374458] size-5"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Microsoft Word Document (.docx)</label>
              </div>
              <div className="flex flex-row relative gap-2">
                <input
                  value="pdf"
                  id="fileTypes"
                  name="fileTypes"
                  type="checkbox"
                  className="accent-[#374458] size-5"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Portable Document Format (.pdf)</label>
              </div>
              <div className="flex flex-row relative gap-2">
                <input
                  value="txt"
                  id="fileTypes"
                  name="fileTypes"
                  type="checkbox"
                  className="accent-[#374458] size-5"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Text (.txt)</label>
              </div>
              {formik.touched.fileTypes && formik.errors.fileTypes ? (
                <div className="flex text-red">{formik.errors.fileTypes}</div>
              ) : null}
            </fieldset>
            <div className="flex relative flex-col gap-4 mb-40">
              <div className="font-bold">Thiết lập phân phát giấy in</div>
              <div>
                Phân phát giấy in miễn phí cho người dùng vào thời điểm nhất
                định
              </div>
              <div className="relative flex flex-row gap-10">
                <div className="relative flex flex-col gap-4">
                  <div className="font-bold">Số lượng</div>
                  <div className="relative flex w-full flex-row gap-4 items-start">
                    <label
                      htmlFor="a4count"
                      className="relative font-bold mt-1"
                    >
                      Giấy A4:
                    </label>
                    <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                      <input
                        id="a4count"
                        name="a4count"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.a4count}
                        className={`${formik.touched.a4count && formik.errors.a4count ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[7.5rem] self-end`}
                      />
                      <div className="absolute text-[#92ABCF] mt-1 mr-4 top-0 right-0">
                        tờ
                      </div>
                      {formik.touched.a4count && formik.errors.a4count ? (
                        <div className="flex text-red max-w-[7.5rem]">
                          {formik.errors.a4count}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative flex w-full flex-row gap-4 items-start">
                    <label
                      htmlFor="a3count"
                      className="relative font-bold mt-1"
                    >
                      Giấy A3:
                    </label>
                    <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                      <input
                        id="a3count"
                        name="a3count"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.a3count}
                        className={`${formik.touched.a3count && formik.errors.a3count ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[7.5rem] self-end`}
                      />
                      <div className="absolute text-[#92ABCF] mt-1 mr-4 top-0 right-0">
                        tờ
                      </div>
                      {formik.touched.a3count && formik.errors.a3count ? (
                        <div className="flex text-red max-w-[7.5rem]">
                          {formik.errors.a3count}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col gap-4">
                  <div className="font-bold">Thời gian</div>
                  <fieldset
                    role="group"
                    aria-labelledby="distributionGroup"
                    className="flex relative flex-row gap-6"
                  >
                    <div className="flex relative flex-col gap-4">
                      <div className="flex flex-row gap-2">
                        <input
                          id="distribution"
                          name="distribution"
                          type="radio"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value="periodically"
                          className="accent-[#374458] size-5"
                        />
                        <div>Theo chu kỳ</div>
                      </div>
                      <div
                        className={`${formik.values.distribution !== 'periodically' ? 'opacity-50 select-none' : ''} flex flex-row gap-2 justify-between`}
                      >
                        <label htmlFor="day" className="mt-1">
                          Ngày:
                        </label>
                        <input
                          id="day"
                          name="day"
                          type="number"
                          disabled={
                            formik.values.distribution !== 'periodically'
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.day}
                          className={`${formik.touched.day && formik.errors.day ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[7.5rem] self-end`}
                        />
                      </div>
                      <div
                        className={`${formik.values.distribution !== 'periodically' ? 'opacity-50 select-none' : ''} flex flex-row gap-2`}
                      >
                        <label htmlFor="period" className="mt-1">
                          Khoảng cách:
                        </label>
                        <select
                          id="period"
                          name="period"
                          disabled={
                            formik.values.distribution !== 'periodically'
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.period}
                          className={`${formik.touched.period && formik.errors.period ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[7.5rem] self-end`}
                        >
                          <option value={1}>1 tháng</option>
                          <option value={3}>3 tháng</option>
                          <option value={6}>6 tháng</option>
                          <option value={12}>12 tháng</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex relative flex-col gap-4">
                      <div className="flex flex-row gap-2">
                        <input
                          id="distribution"
                          name="distribution"
                          type="radio"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value="custom"
                          className="accent-[#374458] size-5"
                        />
                        <div>Tùy chọn:</div>
                      </div>
                      {customDates.map((date, index) => {
                        return (
                          <input
                            key={index}
                            type="date"
                            disabled={formik.values.distribution !== 'custom'}
                            onChange={(value) => console.log(value)}
                            className={`${formik.values.distribution !== 'custom' ? 'opacity-50 text-[#92ABCF]' : ''}border-[#374458] rounded border border-solid p-1 px-4 focus:border-primary w-[15rem] self-end`}
                          />
                        );
                      })}
                      <div
                        onClick={() => {
                          if (formik.values.distribution !== 'custom') return;
                          addCustomDate();
                        }}
                        className={`${formik.values.distribution !== 'custom' ? 'opacity-50' : 'cursor-pointer'} text-[#92ABCF] border-[#92ABCF] rounded border border-dashed h-8 p-1 px-4 focus:border-primary w-[15rem] self-end flex items-center justify-center flex-row gap-2 select-none`}
                      >
                        <Add className="fill-[#92ABCF] size-4" /> Thêm
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="absolute bottom-0 right-0 flex size-fit items-center justify-center rounded-lg bg-primary px-4 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
            >
              Lưu thay đổi
            </button>
          </form>
        </Section>
      </div>
      <Footer />
    </>
  );
}
