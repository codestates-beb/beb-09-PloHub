import React from 'react';
import Image from 'next/image';
import { FaAddressCard } from 'react-icons/fa'
import { ploHub } from '../Reference'

const TokenSendModal = ({ setIsModalOpen }) => {
    return (
        <>
            <form className='
                flex 
                flex-col 
                justify-center 
                items-center 
                gap-6
                w-[90%]'>
                <div className='w-full flex flex-col justify-center gap-3'>
                    <div className='flex items-center gap-3'>
                        <FaAddressCard size={35} className='text-gray-600' />
                        <p className='font-bold text-xl'>지갑 주소</p>
                    </div>
                    <input className='
                        border 
                        rounded-lg 
                        w-full
                        p-1'
                        type="text" />
                </div>
                <div className='w-full flex flex-col justify-center gap-3'>
                    <div className='flex items-center gap-3'>
                        <Image src={ploHub} width={35} height={35} alt='PloHub' />
                        <p className='font-bold text-xl'>PH</p>
                    </div>
                    <input className='
                        border 
                        rounded-lg 
                        w-full
                        p-1'
                        type="number" />
                </div>
                <div className='w-[60%] flex justify-center items-center gap-3'>
                    <button className='
                        w-[6rem]
                        border 
                        rounded-xl 
                        p-3 
                        text-white 
                        bg-gray-600 
                        hover:bg-gray-700 
                        transition 
                        duration-300' 
                        type='button'
                        onClick={() => setIsModalOpen(false)}>
                        취소
                    </button>
                    <button className='
                        w-[6rem]
                        border 
                        rounded-xl 
                        p-3 
                        text-white 
                        bg-blue-main
                        hover:bg-blue-dark 
                        transition 
                        duration-300' 
                        type='submit'>
                        전송
                    </button>
                </div>
            </form>
        </>
    )
}

export default TokenSendModal;

