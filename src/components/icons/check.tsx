type CheckProps = {
  className?: string;
};

const Check = ({ className }: CheckProps) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.00005 5.39L1.61005 4L1.13672 4.47L3.00005 6.33333L7.00005 2.33333L6.53005 1.86333L3.00005 5.39Z"
        fill="current"
      />
    </svg>
  );
};

export default Check;
