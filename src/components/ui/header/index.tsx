import { Link } from '@tanstack/react-router';
import clsx from 'clsx';

const Header = () => {
  return (
    // To navigate, please use Link component supported by React Router

    <div className="relative left-0 top-0 z-50 h-[4.75rem] w-full bg-white shadow-lg">
      This is header
      <Link to="/courses" className={clsx('text-primary')}>
        {' '}
        Courses{' '}
      </Link>
    </div>
  );
};

export default Header;
