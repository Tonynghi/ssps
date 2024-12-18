type PaperProps = {
  className?: string;
};

const Paper = ({ className }: PaperProps) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M29.3971 0C30.0052 0 30.5925 0.221646 31.0489 0.623441L36.0268 5.00518C36.566 5.4798 36.875 6.16341 36.875 6.88174V36.25C36.875 38.3211 35.1961 40 33.125 40H6.875C4.80393 40 3.125 38.3211 3.125 36.25V3.75C3.125 1.67893 4.80393 0 6.875 0H29.3971Z"
        fill="url(#paint0_linear_464_1113)"
      />
      <path
        d="M29.3971 0C30.0052 0 30.5925 0.221646 31.0489 0.623441L36.0268 5.00518C36.566 5.4798 36.875 6.16341 36.875 6.88174V8.75H33.125C31.0539 8.75 29.375 7.07107 29.375 5V0H29.3971Z"
        fill="url(#paint1_linear_464_1113)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_464_1113"
          x1="1690.63"
          y1="0"
          x2="1690.63"
          y2="4000"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#EDEEF4" />
          <stop offset="1" stop-color="#D7D8E6" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_464_1113"
          x1="404.375"
          y1="0"
          x2="404.375"
          y2="862.952"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#DEDEE7" />
          <stop offset="1" stop-color="#CFD0E8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Paper;
