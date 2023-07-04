import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className='bg-gray-500 w-40 h-screen'>
      <ul className='flex flex-col justify-center items-center gap-5 py-8'>
        <li>
          <Link href="/">
            All
          </Link>
        </li>
        <li>
          <Link href="/about">
            행사 정보
          </Link>
        </li>
        <li>
          <Link href="/contact">
            코스 정보
          </Link>
        </li>
        <li>
          <Link href="/contact">
            참여 후기
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
