import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = ({ isOpen }) => {

    return (
        <nav className={
            `absolute 
            top-0 
            transition-all 
            duration-500 
            ease-in-out 
            bg-green-yellow 
            w-64 h-screen 
            transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        }>
            <ul className='flex flex-col justify-center items-center py-8'>
            <li className='hover:bg-green-khaki hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                <Link href='/all'>All</Link>
            </li>
            <li className='hover:bg-green-khaki hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                <Link href='/eventinfo'>행사 정보</Link>
            </li>
            <li className='hover:bg-green-khaki hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                <Link href='/courseinfo'>코스 정보</Link>
            </li>
            <li className='hover:bg-green-khaki hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                <Link href='/review'>참여 후기</Link>
            </li>
            </ul>
        </nav>
    );
};

export default Navbar;
