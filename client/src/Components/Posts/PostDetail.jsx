import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { dummy1, dummy2, dummy3, logoBlack, logoWhite, ploHub } from '../Reference';

const PostDetail = () => {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const { id } = router.query;
    const images = [dummy1, dummy2, dummy3, logoBlack, ploHub];

    console.log(user);
    const isAuthor = user && user.account === 'test@test.com';

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: images.length > 2 ? 3 : images.length,
        slidesToScroll: images.length > 2 ? 3 : images.length,
    };

    return (
        <>
            <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
                <div className='flex justify-between border-b-2 border-black w-full'>
                    <p className='font-bold text-4xl mb-5'>All</p>
                    {isAuthor && 
                        <button className='w-28 h-12 rounded-xl bg-red-400 hover:bg-red-500 text-white text-white transition duration-300'>
                            Delete
                        </button>
                    }
                </div>
                <div className='w-full flex justify-between border-b'>
                    <p className='mb-5 font-semibold text-xl'>게시글 제목</p>
                    <div className='flex gap-20 font-semibold text-xl'>
                        <p>작성자</p>
                        <p>작성 날짜</p>
                    </div>
                </div>
                <div className='w-full max-h-full flex flex-col whitespace-pre-wrap'>
                    <div className='w-[60%] h-[60%]  mx-auto mb-10'>
                        <Slider {...settings} className='relative w-full h-full flex justify-center items-center'>
                            {images.map((src, index) => (
                                // <div key={index} className="w-full h-full">
                                    <Image src={src} layout="fill" objectFit="contain" key={index}/>
                                // </div>
                            ))}
                        </Slider>
                    </div>
                    <div>
                        국교는 인정되지 아니하며, 종교와 정치는 분리된다. 헌법개정안은 국회가 의결한 후 30일 이내에 국민투표에 붙여 국회의원선거권자 과반수의 투표와 투표자 과반수의 찬성을 얻어야 한다. 
                        국회나 그 위원회의 요구가 있을 때에는 국무총리·국무위원 또는 정부위원은 출석·답변하여야 하며, 국무총리 또는 국무위원이 출석요구를 받은 때에는 국무위원 또는 정부위원으로 하여금 출석·답변하게 할 수 있다. 
                        국군은 국가의 안전보장과 국토방위의 신성한 의무를 수행함을 사명으로 하며, 그 정치적 중립성은 준수된다. 

                        모든 국민은 보건에 관하여 국가의 보호를 받는다. 대통령은 국가의 원수이며, 외국에 대하여 국가를 대표한다. 공무원의 신분과 정치적 중립성은 법률이 정하는 바에 의하여 보장된다. 
                        국채를 모집하거나 예산외에 국가의 부담이 될 계약을 체결하려 할 때에는 정부는 미리 국회의 의결을 얻어야 한다. 
                        대통령은 조약을 체결·비준하고, 외교사절을 신임·접수 또는 파견하며, 선전포고와 강화를 한다. 한 회계연도를 넘어 계속하여 지출할 필요가 있을 때에는 정부는 연한을 정하여 계속비로서 국회의 의결을 얻어야 한다. 
                        국방상 또는 국민경제상 긴절한 필요로 인하여 법률이 정하는 경우를 제외하고는, 사영기업을 국유 또는 공유로 이전하거나 그 경영을 통제 또는 관리할 수 없다.
                    </div>
                </div>
                <div className='w-full flex gap-3 justify-end my-16'>
                    {isAuthor && 
                        <Link 
                            href={`/posts/edit/${id}`}
                            className='
                                w-[15%] 
                                border 
                                rounded-2xl 
                                p-3 
                                bg-blue-main 
                                text-white 
                                hover:bg-blue-dark 
                                transition 
                                duration-300
                                text-center'>
                            <button>
                                Edit
                            </button>
                        </Link>
                    }
                    <Link href='/' 
                        className='
                        w-[15%] 
                        border 
                        rounded-2xl 
                        p-3 
                        bg-blue-dark 
                        text-white 
                        hover:bg-blue-main 
                        transition 
                        duration-300
                        text-center'>
                        <button>
                            List
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default PostDetail;