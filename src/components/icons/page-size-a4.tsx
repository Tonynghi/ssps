type PageSizeA4Props = {
  className?: string;
};

const PageSizeA4 = ({ className }: PageSizeA4Props) => {
  return (
    <svg
      width="60"
      height="81"
      viewBox="0 0 60 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="60" height="81" fill="#1488DB" />
      <path
        d="M17.6202 50H13.6656L19.6912 32.5455H24.4469L30.4639 50H26.5094L22.1372 36.5341H22.0009L17.6202 50ZM17.373 43.1392H26.7139V46.0199H17.373V43.1392ZM31.7903 46.9318V44.0256L39.0772 32.5455H41.5829V36.5682H40.1L35.5062 43.8381V43.9744H45.8613V46.9318H31.7903ZM40.1682 50V46.0455L40.2363 44.7585V32.5455H43.6966V50H40.1682Z"
        fill="white"
      />
    </svg>
  );
};

export default PageSizeA4;
