type RectProps = {
  className?: string;
  onClick?: () => void;
};

const Rect = ({ className, onClick }: RectProps) => {
  return (
    <svg
      width="16"
      height="9"
      viewBox="0 0 16 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path d="M0 0.503661L16 0.503662L8 8.50366L0 0.503661Z" fill="current" />
    </svg>
  );
};

export default Rect;
