import * as Yup from 'yup';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Section from '@/components/ui/section-wrapper';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Printer from '@/components/icons/printer';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/printer/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum venenatis ante non massa pretium sollicitudin. Nulla venenatis euismod risus sit amet fermentum. Etiam scelerisque metus in diam feugiat, at tincidunt lorem tempor. Morbi porttitor fermentum sapien, sed dictum erat congue ut. Aenean tincidunt, ex in interdum vulputate, diam ligula posuere augue, ac blandit diam nisl sit amet elit. ',
      brand: 'Canon',
      model: 'PIXMA',
      branch: '268 Lý Thường Kiệt',
      block: 'A4',
      room: '404',
    },
    validationSchema: Yup.object({
      description: Yup.string().optional(),
      brand: Yup.string().optional(),
      model: Yup.string().optional(),
      branch: Yup.string().required('Xin nhập cơ sở nơi chứa máy in!'),
      block: Yup.string().required('Xin nhập tòa nhà chứa máy in!'),
      room: Yup.string().required('Xin nhập phòng chứa máy in!'),
    }),
    onSubmit: (value) => {
      console.log(value);
      toast.success('Cập nhật máy thành công!');
      navigate({ to: '/management' });
    },
  });

  return (
    <>
      <div className="relative flex flex-col">
        <Header />
        <Section className="flex flex-col gap-6">
          <div className="font-bold text-[40px] text-primary">
            Thông tin máy in
          </div>
          <div className="relative flex flex-row w-full justify-between">
            <div className="bg-[#92ABCF] w-[22.5rem] h-[32.5rem] flex items-center justify-center relative">
              <Printer />
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex relative flex-col w-[55rem] gap-4"
            >
              <div className="font-bold text-[24px] text-primary">
                Thông tin cơ bản
              </div>
              <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                <label htmlFor="name" className="relative font-bold mt-1">
                  Tên:
                </label>
                <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                  <div id="a4count" className={`p-1 px-4 w-[40rem] self-end`}>
                    Máy in 1
                  </div>
                </div>
              </div>
              <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                <label
                  htmlFor="description"
                  className="relative font-bold mt-1"
                >
                  Mô tả:
                </label>
                <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                  <textarea
                    id="a4count"
                    name="description"
                    rows={4}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    className={`${formik.touched.description && formik.errors.description ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[40rem] self-end`}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="flex text-red max-w-[40rem]">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                <label htmlFor="brand" className="relative font-bold mt-1">
                  Hãng:
                </label>
                <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                  <input
                    id="a4count"
                    name="brand"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.brand}
                    className={`${formik.touched.brand && formik.errors.brand ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[40rem] self-end`}
                  />
                  {formik.touched.brand && formik.errors.brand ? (
                    <div className="flex text-red max-w-[40rem]">
                      {formik.errors.brand}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                <label htmlFor="model" className="relative font-bold mt-1">
                  Mẫu:
                </label>
                <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                  <input
                    id="a4count"
                    name="model"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.model}
                    className={`${formik.touched.model && formik.errors.model ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[40rem] self-end`}
                  />
                  {formik.touched.model && formik.errors.model ? (
                    <div className="flex text-red max-w-[40rem]">
                      {formik.errors.model}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                <label htmlFor="location" className="relative font-bold mt-1">
                  Vị trí:
                </label>
                <div className="relative flex flex-col w-[40rem] items-end justify-end gap-2 lg:items-start">
                  <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                    <label htmlFor="branch" className="relative font-bold mt-1">
                      Cơ sở:
                    </label>
                    <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                      <input
                        id="a4count"
                        name="branch"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.branch}
                        className={`${formik.touched.branch && formik.errors.branch ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[35rem] self-end`}
                      />
                      {formik.touched.branch && formik.errors.branch ? (
                        <div className="flex text-red max-w-[40rem]">
                          {formik.errors.branch}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                    <label htmlFor="block" className="relative font-bold mt-1">
                      Tòa:
                    </label>
                    <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                      <input
                        id="a4count"
                        name="block"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.block}
                        className={`${formik.touched.block && formik.errors.block ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[35rem] self-end`}
                      />
                      {formik.touched.block && formik.errors.block ? (
                        <div className="flex text-red max-w-[40rem]">
                          {formik.errors.block}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative flex w-full flex-row gap-4 items-start justify-between">
                    <label htmlFor="room" className="relative font-bold mt-1">
                      Phòng:
                    </label>
                    <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                      <input
                        id="a4count"
                        name="room"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.room}
                        className={`${formik.touched.room && formik.errors.room ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[35rem] self-end`}
                      />
                      {formik.touched.room && formik.errors.room ? (
                        <div className="flex text-red max-w-[40rem]">
                          {formik.errors.room}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mt-4 flex flex-row gap-4 self-end bottom-0">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Máy in 1 đã bị xóa!');
                    navigate({ to: '/management' });
                  }}
                  className="relative mt-2 flex size-fit items-center justify-center rounded-lg px-12 py-2 font-bold text-white duration-200 ease-in-out bg-red hover:bg-red-700 self-end"
                >
                  Xóa máy
                </button>
                <button
                  type="submit"
                  className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
