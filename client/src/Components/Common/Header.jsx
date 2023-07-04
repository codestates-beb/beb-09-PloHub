import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { logoWhite } from '../Reference';

const Header = () => {
    return (
        <>
            <div className="h-24 bg-green-700 text-white py-4 px-6 grid grid-cols-2 content-center overflow-hidden">
                <div className='flex justify-start items-center h-24'>
					<Link href='/'>
						<Image src={logoWhite} alt="Logo" width={200} height="auto"/>
					</Link>
                </div>
                <div className='flex items-center gap-5 col-end-5 px-8'>
                    <div className='border border-solid rounded p-2 hover:bg-white hover:text-black transition-all duration-300'>
                        <button>Sign In</button>
                    </div>
                    <div className='border border-solid rounded p-2 hover:bg-white hover:text-black transition-all duration-300'>
                        <button>Sign Up</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
