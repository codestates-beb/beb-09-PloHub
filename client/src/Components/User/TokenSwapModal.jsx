import React from 'react';
import Image from 'next/image';
import { FaArrowCircleDown, FaEthereum } from 'react-icons/fa'
import { ploHub } from '../Reference'

const TokenSwapModal = ({ setIsModalOpen }) => {

    const handleTokenAmountChange = (e) => {
        // ERC-20 수량 변경 시 처리 로직
    };

    const handleEthAmountChange = (e) => {
        // ETH 수량 변경 시 처리 로직
    };

    return (
        <>
            <form className='
                flex 
                flex-col 
                justify-center 
                items-center 
                gap-6
                w-[70%]'>
                <div className='w-full flex items-center gap-3'>
                    <Image src={ploHub} width={40} height={40} alt='PloHub' />
                    <p className='font-bold text-xl'>PH</p>
                    <input className='
                        border 
                        rounded-lg 
                        w-full
                        p-2'
                        type="number" 
                        onChange={handleTokenAmountChange} />
                </div>
                <FaArrowCircleDown size={50}  className="text-gray-500" />
                <div className='w-full flex items-center gap-3'>
                    <FaEthereum size={30} />
                    <p className='font-bold text-xl'>ETH</p>
                    <input className='
                        border 
                        rounded-lg 
                        w-full
                        p-2'
                        type="number" 
                        onChange={handleEthAmountChange} />
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

export default TokenSwapModal;