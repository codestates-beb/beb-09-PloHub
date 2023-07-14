import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const router = useRouter();
    const [isNavOpen, setIsNavOpen] = useState(false);

    /**
     * `isNavOpen` 상태 값을 토글하는 함수
     * 현재 상태가 `true`이면 `false`로, `false`이면 `true`로 변경
     * 이 함수는 주로 네비게이션 메뉴의 열기/닫기를 제어하는데 사용
     */
    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    /**
     * 선택한 카테고리에 따라 화면을 변경하는 함수
     * 입력된 카테고리를 쿼리 파라미터로 추가하고, 메인 페이지('/')로 이동
     * 
     * @param {string} category - 사용자가 선택한 카테고리
     */
    const categoryChange = (category) => {
        router.push({
            pathname: '/',
            query: { category }
        })
    }
    
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
                    <li className='
                        hover:bg-blue-skin 
                        hover:text-white 
                        font-bold 
                        text-lg 
                        w-full 
                        flex 
                        items-center 
                        justify-center 
                        h-16 
                        transition-all 
                        duration-200
                        cursor-pointer'
                        onClick={() => categoryChange()}>
                        All
                    </li>
                    <li className='
                        hover:bg-blue-skin 
                        hover:text-white 
                        font-bold 
                        text-lg 
                        w-full 
                        flex 
                        items-center 
                        justify-center 
                        h-16 
                        transition-all 
                        duration-200
                        cursor-pointer'
                        onClick={() => categoryChange(1)}>
                        행사 정보
                    </li>
                    <li className='
                        hover:bg-blue-skin 
                        hover:text-white 
                        font-bold 
                        text-lg 
                        w-full 
                        flex 
                        items-center 
                        justify-center 
                        h-16 
                        transition-all 
                        duration-200
                        cursor-pointer'
                        onClick={() => categoryChange(2)}>
                        코스 정보
                    </li>
                    <li className='
                        hover:bg-blue-skin 
                        hover:text-white 
                        font-bold 
                        text-lg 
                        w-full 
                        flex 
                        items-center 
                        justify-center 
                        h-16 
                        transition-all 
                        duration-200
                        cursor-pointer'
                        onClick={() => categoryChange(3)}>
                        참여 후기
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
