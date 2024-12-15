import * as Yup from 'yup';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Section from '@/components/ui/section-wrapper';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import Printer from '@/components/icons/printer';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Logo from '@/components/icons/logo';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Xin nhập tài khoản!'),
      password: Yup.string().required('Xin nhập mật khẩu!'),
    }),
    onSubmit: (value) => {
      console.log(value);
      toast.success('Đăng nhập thành công!');
      navigate({ to: '/' });
    },
  });

  return (
    <>
      <div className="relative flex flex-col">
        {/* <Header /> */}
        <Logo className="absolute h-10 top-10 left-10 items-center" />
        <Section className="flex !flex-row justify-between gap-6 h-screen items-center">
          <div className="relative flex flex-col w-full justify-between">
            <div className="font-bold text-[40px] text-primary">Đăng nhập</div>

            <form
              onSubmit={formik.handleSubmit}
              className="flex relative flex-col w-[40rem] gap-4"
            >
              <div className="relative flex w-full flex-col gap-4 items-start">
                <label htmlFor="brand" className="relative font-bold mt-1">
                  Tài khoản:
                </label>
                <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                  <input
                    id="a4count"
                    name="username"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    className={`${formik.touched.username && formik.errors.username ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[40rem] self-end`}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="flex text-red max-w-[40rem]">
                      {formik.errors.username}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative flex w-full flex-col gap-4 items-start">
                <label htmlFor="password" className="relative font-bold mt-1">
                  Mật khẩu:
                </label>
                <div className="relative flex flex-col items-end justify-end gap-2 lg:items-start">
                  <input
                    id="a4count"
                    name="password"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`${formik.touched.password && formik.errors.password ? 'border-red' : 'border-[#374458]'} rounded border border-solid p-1 px-4 focus:border-primary w-[40rem] self-end`}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="flex text-red max-w-[40rem]">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative mt-4 flex flex-row gap-4 bottom-0">
                <button
                  type="submit"
                  className="relative mt-2 flex size-fit items-center justify-center rounded-lg bg-primary px-12 py-2 font-bold text-white duration-200 ease-in-out hover:bg-primary-700 self-end w-full"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
          <div className="bg-[#92ABCF] w-[70rem] h-[40rem] flex items-center justify-center relative">
            <img src="/login-bg.png" className="size-full object-cover" />
          </div>
        </Section>
      </div>
      {/* <Footer /> */}
    </>
  );
}
