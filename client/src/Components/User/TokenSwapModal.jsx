import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import { FaArrowCircleDown, FaEthereum } from 'react-icons/fa'
import { ploHub, ModalLayout } from '../Reference'

const TokenSwapModal = ({ setIsModalOpen }) => {
    const [tokenAmount, setTokenAmount] = useState('');
    const [ethAmount, setEthAmount] = useState('');
    const [modalOpen, setModalOpen] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const router = useRouter();
  
    /**
     * 사용자가 입력한 토큰의 양에 따라 상응하는 이더리움의 양을 계산하고 설정하는 함수
     * 이 함수는 입력 이벤트에서 호출되며, 토큰과 이더리움의 교환 비율을 기반으로 계산
     * 이 경우, 토큰 1000개당 이더리움 1개로 계산
     *
     * @param {object} e - 이벤트 객체
     */
    const tokenAmountChange = (e) => {
        const inputTokenAmount = e.target.value;
        setTokenAmount(inputTokenAmount);
  
        // 토큰 스왑 비율 계산
        const tokenToEthRatio = 1000; // 토큰 1000개당 이더 1개로 가정
        const calculatedEthAmount = inputTokenAmount / tokenToEthRatio;
        setEthAmount(calculatedEthAmount);
    };

    /**
     * 토큰과 이더리움 간의 교환을 처리하는 비동기 함수
     * 사용자가 입력한 토큰 양을 사용하여 서버에 토큰 교환 요청을 보내며,
     * 응답이 성공적인 경우, 토큰 교환 성공 메시지를 모달로 표시하고 페이지를 새로 고침
     * 만약 요청이 실패한 경우, 오류 메시지를 모달로 표시
     * 모든 모달은 자동적으로 3초 후에 닫히게 됨
     */
    const tokenSwap = async () => {
        const formData = new FormData();
        const token = cookie.parse(document.cookie || '');

        formData.append('token_amount', tokenAmount);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token/swap`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setModalOpen(true);
                setModalTitle('Success');
                setModalBody('토큰 교환이 완료되었습니다.');

                setTimeout(() => {
                    setModalOpen(false);
                    router.reload();
                }, 3000);
            }
        } catch (error) {
            console.log('Error', error.message)
            setModalOpen(true);
            setModalTitle('Error');
            setModalBody(error.message);

            setTimeout(() => {
                setModalOpen(false);
            }, 3000);
        }
    }

    return (
        <>
            <div className='
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
                        type="text" 
                        value={tokenAmount}
                        onChange={tokenAmountChange} />
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
                        value={ethAmount}
                        disabled />
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
                        onClick={tokenSwap}>
                        교환
                    </button>
                </div>
            </div>
            <ModalLayout isOpen={modalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default TokenSwapModal;