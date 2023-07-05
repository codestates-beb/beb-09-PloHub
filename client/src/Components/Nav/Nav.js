import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <div className='relative h-full'>
            <div className={
                `w-12
                h-12
                flex 
                justify-center 
                items-center 
                absolute
                top-8 
                left-12 
                border
                p-2
                rounded
                border-solid
                border-gray
                transition-all 
                duration-500 
                ease-in-out 
                transform ${isNavOpen ? 'translate-x-64' : 'translate-x-0'}
                cursor-pointer`
            } onClick={handleToggle}>
                {isNavOpen ? (
                    <FiX style={{ fontSize: '1.5rem', color: '#999' }} />
                ) : (
                    <FiMenu style={{ fontSize: '1.5rem', color: '#999' }} />
                )}
            </div>
            <div className={
                `absolute 
                top-0 
                left-0 
                bottom-0 
                transition-all 
                duration-500 
                ease-in-out 
                bg-blue-white 
                w-64 
                h-screen 
                transform ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`
            }>
                <ul className='flex flex-col justify-center items-center py-8'>
                    <li className='hover:bg-blue-skin hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                        <Link href='/all'>All</Link>
                    </li>
                    <li className='hover:bg-blue-skin hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                        <Link href='/eventinfo'>행사 정보</Link>
                    </li>
                    <li className='hover:bg-blue-skin hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                        <Link href='/courseinfo'>코스 정보</Link>
                    </li>
                    <li className='hover:bg-blue-skin hover:text-white font-bold text-lg w-full flex items-center justify-center h-16 transition-all duration-200'>
                        <Link href='/review'>참여 후기</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
