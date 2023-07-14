import React from 'react';
import { AiFillGithub, AiFillInstagram, AiOutlineMail } from 'react-icons/ai';
import Link from 'next/link';
import { BsDiscord } from 'react-icons/bs'


const Footer = () => {
    return (
        <footer className='flex flex-col justify-center gap-12 h-56 w-full bg-blue-main'>
            <div className='flex justify-center items-center gap-10 text-white mt-12'>
                <Link href='https://github.com/codestates-beb/beb-09-PloHub' target='_blank'>
                    <AiFillGithub size={100} className='border rounded-xl p-3 w-14 h-14 cursor-pointer hover:bg-blue-dark transition duration-300' />
                </Link>
                <Link href='' onClick={(e) => e.preventDefault()}>
                    <AiFillInstagram size={100} className='border rounded-xl p-3 w-14 h-14 cursor-pointer hover:bg-blue-dark transition duration-300' />
                </Link>
                <Link href='' onClick={(e) => e.preventDefault()}>
                    <AiOutlineMail size={100} className='border rounded-xl p-3 w-14 h-14 cursor-pointer hover:bg-blue-dark transition duration-300' />
                </Link>
                <Link href='' onClick={(e) => e.preventDefault()}>
                    <BsDiscord size={100} className='border rounded-xl p-3 w-14 h-14 cursor-pointer hover:bg-blue-dark transition duration-300' />
                </Link>
            </div>
            <div className='flex justify-center items-center text-white font-semibold'>
                <p>Copyright &copy; 2023 BEB-09-BlockPanther</p>
            </div>
        </footer>
    )

}

export default Footer;