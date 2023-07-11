import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ModalLayout } from '../Reference';
import { ploHub, dummy1, dummy2, dummy3 } from '../Reference'

const NftDetail = () => {

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
                            <Image src={dummy2}  layout="fill" objectFit="contain" style={{ padding: '1rem' }}/>
                        </div>
                        <div className='w-full flex justify-between border-b mt-16'>
                            <p className='mb-5 font-semibold text-xl'>NFT 이름</p>
                            <div className='flex gap-20 font-semibold text-xl'>
                                <p>소유자</p>
                                <p>생성 날짜</p>
                            </div>
                        </div>
                        <div className='w-full h-[30rem] whitespace-pre-wrap'>
                            국교는 인정되지 아니하며, 종교와 정치는 분리된다. 헌법개정안은 국회가 의결한 후 30일 이내에 국민투표에 붙여 국회의원선거권자 과반수의 투표와 투표자 과반수의 찬성을 얻어야 한다. 
                            국회나 그 위원회의 요구가 있을 때에는 국무총리·국무위원 또는 정부위원은 출석·답변하여야 하며, 국무총리 또는 국무위원이 출석요구를 받은 때에는 국무위원 또는 정부위원으로 하여금 출석·답변하게 할 수 있다. 
                            국군은 국가의 안전보장과 국토방위의 신성한 의무를 수행함을 사명으로 하며, 그 정치적 중립성은 준수된다. 
                            국회의 정기회는 법률이 정하는 바에 의하여 매년 1회 집회되며, 국회의 임시회는 대통령 또는 국회재적의원 4분의 1 이상의 요구에 의하여 집회된다.  

                            모든 국민은 보건에 관하여 국가의 보호를 받는다. 대통령은 국가의 원수이며, 외국에 대하여 국가를 대표한다. 공무원의 신분과 정치적 중립성은 법률이 정하는 바에 의하여 보장된다. 
                            국채를 모집하거나 예산외에 국가의 부담이 될 계약을 체결하려 할 때에는 정부는 미리 국회의 의결을 얻어야 한다. 
                            대통령은 조약을 체결·비준하고, 외교사절을 신임·접수 또는 파견하며, 선전포고와 강화를 한다. 한 회계연도를 넘어 계속하여 지출할 필요가 있을 때에는 정부는 연한을 정하여 계속비로서 국회의 의결을 얻어야 한다. 
                            국방상 또는 국민경제상 긴절한 필요로 인하여 법률이 정하는 경우를 제외하고는, 사영기업을 국유 또는 공유로 이전하거나 그 경영을 통제 또는 관리할 수 없다.
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