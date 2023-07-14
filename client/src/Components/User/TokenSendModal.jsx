import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import cookie from 'cookie';
import { useRouter } from 'next/router';
import { FaAddressCard } from 'react-icons/fa'
import { ploHub, ModalLayout } from '../Reference'

const TokenSendModal = ({ setIsModalOpen }) => {
    const router = useRouter();
    const [toAddr, setToAddr] = useState('');
    const [tokenAmount, setTokenAmount] = useState(0);
    const [modalOpen, setModalOpen] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    /**
     * 토큰 전송을 처리하는 비동기 함수
     * 사용자가 입력한 주소와 토큰 양을 사용하여 서버에 토큰 전송 요청을 보내며,
     * 응답이 성공적인 경우, 토큰 전송 성공 메시지를 모달로 표시하고 페이지를 새로 고침
     * 만약 요청이 실패한 경우, 오류 메시지를 모달로 표시
     * 모든 모달은 자동적으로 3초 후에 닫히게 됨
     */
    const tokenSend = async () => {
        const token = cookie.parse(document.cookie || '');
        const formData = new FormData();

        formData.append('to_address', toAddr);
        formData.append('token_amount', tokenAmount);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token/transfer`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setModalOpen(true);
                setModalTitle('Success');
                setModalBody('토큰 전송이 완료되었습니다.');

                setTimeout(() => {
                    setModalOpen(false);
                    router.reload();
                }, 3000);
            }
        } catch (error) {
            console.log('Error', error.message);
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
                        type="text"
                        onChange={(e) => setToAddr(e.target.value)} />
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
                        type="number"
                        onChange={(e) => setTokenAmount(e.target.value)}/>
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
                        onClick={tokenSend}>
                        전송
                    </button>
                </div>
            </div>
            <ModalLayout isOpen={modalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default TokenSendModal;

