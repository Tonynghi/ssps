const Footer = () => {
  return (
    // To navigate, please use Link component supported by React Router

    <div className="bottom-0 left-0 px-5 xs:px-[32px] sm:px-10 lg:px-[48px] xl:px-[80px] 2xl:px-[96px] 3xl:px-[calc(160px-(1920px-100vw)/3)] h-16 w-full bg-gradient-to-r from-[#022A93] to-[#1488DB] flex flex-row justify-between items-center">
      <img
        alt="Logo Bách Khoa"
        src="/logo.png"
        className="h-12 object-contain select-none"
      />
      <div className="text-white font-bold text-[12px] select-none">
        BẢN QUYỀN THUỘC TRƯỜNG ĐẠI HỌC BÁCH KHOA - ĐHQG-HCM
      </div>
    </div>
  );
};

export default Footer;
