type PositionProps = {
  className?: string;
  onClick?: () => void;
};

const Position = ({ onClick, className }: PositionProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        d="M8 1.33301C5.42 1.33301 3.33334 3.41967 3.33334 5.99967C3.33334 9.49967 8 14.6663 8 14.6663C8 14.6663 12.6667 9.49967 12.6667 5.99967C12.6667 3.41967 10.58 1.33301 8 1.33301ZM8 7.66634C7.08 7.66634 6.33334 6.91967 6.33334 5.99967C6.33334 5.07967 7.08 4.33301 8 4.33301C8.92 4.33301 9.66667 5.07967 9.66667 5.99967C9.66667 6.91967 8.92 7.66634 8 7.66634Z"
        fill="#92ABCF"
      />
    </svg>
  );
};

export default Position;
