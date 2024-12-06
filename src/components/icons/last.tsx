type LastProps = {
  className?: string;
  onClick: () => void;
};

const Last = ({ onClick, className }: LastProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path d="M16 7.5L12 12L16 16" stroke="current" stroke-linecap="round" />
      <path d="M13 7.5L9 12L13 16" stroke="current" stroke-linecap="round" />
    </svg>
  );
};

export default Last;
