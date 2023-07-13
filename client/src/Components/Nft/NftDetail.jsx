import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ModalLayout } from '../Reference';
import { ploHub, dummy1, dummy2, dummy3 } from '../Reference'

const NftDetail = ({ nftInfo }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const user = useSelector((state) => state.user);
    const router = useRouter();

    return (
        <>
            <div className='w-[50%] min-h-screen mx-auto mt-20 flex flex-col gap-20'>
                <div>
                    <div className='flex flex-col gap-6'>
                        <div className="w-full h-[30rem] flex items-center justify-center relative">
                            <Image src={nftInfo.image}  layout="fill" objectFit="contain" style={{ padding: '1rem' }}/>
                        </div>
                        <div className='w-full flex justify-between border-b mt-16'>
                            <p className='mb-5 font-semibold text-xl'>{nftInfo.name}</p>
                            <div className='flex gap-6 font-semibold text-xl'>
                                <p>
                                    {nftInfo.owner_address.slice(0, 8) + '...' + nftInfo.owner_address.slice(-5)}
                                </p>
                                <p>
                                    {nftInfo.created_at.split('T')[0]} {nftInfo.created_at.substring(11,19)}
                                </p>
                                
                            </div>
                        </div>
                        <div className='w-full h-[30rem] whitespace-pre-wrap'>
                            {nftInfo.description}
                        </div>
                        <div className="mb-12 w-full">
                            <button className="
                                bg-blue-dark 
                                hover:bg-blue-main 
                                text-white 
                                text-lg 
                                font-bold 
                                py-2 
                                px-4 
                                rounded-lg 
                                transition 
                                duration-300 
                                w-full 
                                h-[3rem]" 
                                type='button'>
                                Sell
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )

}

export default NftDetail;