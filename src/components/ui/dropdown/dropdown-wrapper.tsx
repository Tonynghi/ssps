import { ReactNode, useEffect, useRef } from 'react';

type DropdownProps = {
  isOpened: boolean;
  close: () => void;
  className?: string;
  children: ReactNode;
};

const Dropdown = ({ isOpened, close, className, children }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      event.target &&
      event.target instanceof Node &&
      !dropdownRef.current.contains(event.target)
    ) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`${isOpened ? 'flex' : 'hidden'}  ${className}`}
    >
      {children}
    </div>
  );
};

export default Dropdown;
