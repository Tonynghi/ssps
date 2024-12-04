type PrinterProps = {
  className?: string;
};

const Printer = ({ className }: PrinterProps) => {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M80.0002 6.62006H24.9421V67.543H80.0002H135.058V6.62006H80.0002Z"
        fill="#DAE4F4"
      />
      <path
        d="M135.058 6.62006H80.0002V67.543H135.058V6.62006Z"
        fill="#C6D6EA"
      />
      <path
        d="M141.443 48.7709V64.0017H78.7695H16.0959V48.7709H0V147.465H160V48.7709H141.443Z"
        fill="#1488DB"
      />
      <path
        d="M141.443 48.7709V64.0017H80.0002V147.465H160V48.7709H141.443Z"
        fill="#022A93"
      />
      <path
        d="M140.923 74.1555H100.308V84.3092H140.923V74.1555Z"
        fill="#374458"
      />
      <path
        d="M140.923 89.3864H100.308V99.5401H140.923V89.3864Z"
        fill="white"
      />
      <path d="M146 127.201H14.0001V147.842H146V127.201Z" fill="#212D3F" />
      <path d="M146 127.201H80.0002V147.842H146V127.201Z" fill="#374458" />
      <path d="M49.5385 135.38H14.0001V153.38H49.5385V135.38Z" fill="#202D3F" />
      <path d="M146 135.38H110.461V153.38H146V135.38Z" fill="#374458" />
    </svg>
  );
};

export default Printer;
