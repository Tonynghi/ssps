type NotificationsProps = {
  className?: string;
};

const Notifications = ({ className }: NotificationsProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 29.3333C17.4667 29.3333 18.6667 28.1333 18.6667 26.6667H13.3334C13.3334 28.1333 14.52 29.3333 16 29.3333ZM24 21.3333V14.6667C24 10.5733 21.8134 7.14667 18 6.24V5.33333C18 4.22667 17.1067 3.33333 16 3.33333C14.8934 3.33333 14 4.22667 14 5.33333V6.24C10.1734 7.14667 8.00004 10.56 8.00004 14.6667V21.3333L5.33337 24V25.3333H26.6667V24L24 21.3333Z"
        fill="current"
      />
    </svg>
  );
};

export default Notifications;
