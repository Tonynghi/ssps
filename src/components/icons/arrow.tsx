type ArrowProps = {
  className?: string;
  onClick: () => void;
};

const Arrow = ({ onClick, className }: ArrowProps) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path d="M8 8V0L0 4L8 8Z" fill="#374458" />
    </svg>
  );
};

export default Arrow;
