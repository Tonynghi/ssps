import Logo from '@/components/icons/logo';
import Notifications from '@/components/icons/notifications';
import Profile from '@/components/icons/profile';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import Dropdown from '../dropdown/dropdown-wrapper';
import Check from '@/components/icons/check';

const Header = () => {
  const [notificationsDropdown, setDropdownNotifications] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <div className="relative left-0 top-0 z-50 h-[4.75rem] w-full bg-white shadow-lg px-20 py-5 flex flex-row justify-between">
      <Link to="/" className="relative">
        <Logo className="relative h-10 items-center" />
      </Link>
      <div className="flex flex-row relative gap-6">
        <Link
          to="/management"
          className="hover:text-[#022A93] duration-200 ease-in-out relative flex items-center justify-center"
        >
          Quản lý hệ thống
        </Link>
        <Link
          to="/statistics"
          className="hover:text-[#022A93] duration-200 ease-in-out relative flex items-center justify-center"
        >
          Thống kê
        </Link>
        <Link
          to="/history"
          className="hover:text-[#022A93] duration-200 ease-in-out relative flex items-center justify-center"
        >
          Lịch sử
        </Link>
        <div className="relative flex items-center justify-center h-full aspect-square ml-4">
          <div
            onClick={() => {
              setDropdownNotifications(true);
            }}
            className="relative size-8 flex cursor-pointer group"
          >
            <Notifications className="size-8 relative flex fill-[#3D4863] group-hover:fill-[#022A93] duration-200 ease-in-out" />
          </div>
          <Dropdown
            isOpened={notificationsDropdown}
            close={() => setDropdownNotifications(false)}
            className="absolute w-96 flex flex-col h-fit bg-white top-10 right-0 shadow-lg p-2 gap-3 rounded-lg"
          >
            <div className="relative gap-2 flex flex-row">
              <div className="min-w-6 min-h-6 h-6 w-6 rounded-full bg-[#022A93] flex items-center justify-center relative"></div>
              <div className="relative">3 thông báo mới</div>
            </div>
            {[...Array(3).keys()].map(() => {
              return (
                <div className="relative gap-2 flex flex-row">
                  <div className="min-w-6 min-h-6 h-6 w-6 rounded-full bg-[#81C995] flex items-center justify-center relative">
                    <Check className="size-4 fill-[#34A853]" />
                  </div>
                  <div className="flex relative flex-col ">
                    <div className="font-bold">Yêu cầu in hoàn thành!</div>
                    <div>
                      Yêu cầu in baitaplon.docx của bạn đã hoàn thành, hãy đến
                      phòng 0 tòa A3 để nhận!
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="w-full mt-2 flex flex-row justify-end text-[#022A93]">
              <div className="cursor-pointer rounded-lg hover:bg-slate-200 duration-200 ease-in-out p-1">
                Đánh dấu đã đọc tất cả
              </div>
            </div>
          </Dropdown>
        </div>
        <div className="relative">
          <div
            onClick={() => setUserDropdown(true)}
            className="relative flex flex-row gap-4 items-center cursor-pointer"
          >
            <Profile className="size-10" />
            <div>Nguyễn Văn A</div>
          </div>
          <Dropdown
            isOpened={userDropdown}
            close={() => setUserDropdown(false)}
            className="absolute w-40 flex flex-col h-fit bg-white top-10 right-0 shadow-lg p-2 gap-3 rounded-lg cursor-pointer hover:bg-red-300 duration-200 ease-in-out"
          >
            <Link to="/login" className="relative gap-2 flex flex-row text-red">
              Đăng xuất
            </Link>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
