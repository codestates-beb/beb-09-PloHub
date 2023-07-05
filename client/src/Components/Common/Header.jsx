import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { FaCircleUser } from 'react-icons/fa6';
import { BiSolidDownArrow, BiSolidUser } from 'react-icons/bi';
import { IoMdCreate } from 'react-icons/io';
import { IoCreateOutline } from 'react-icons/io5';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { logoWhite } from '../Reference';

const Header = () => {
    const { user } = useSelector((state) => state);

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [arrowRotation, setArrowRotation] = useState(0);
    const [menuHeight, setMenuHeight] = useState(0);

    const menuToggle = () => {
        setMenuOpen(!isMenuOpen);
        setArrowRotation(arrowRotation + 180);
        setMenuHeight(isMenuOpen ? 0 : 100); // 메뉴가 열릴 때는 고정된 높이 값을 설정

        // 메뉴가 열리고 닫힐 때 애니메이션을 부드럽게 처리하기 위해 setTimeout을 사용
        setTimeout(() => {
            setMenuHeight(isMenuOpen ? 100 : 0); // 메뉴가 닫힐 때는 높이를 0으로 설정
        }, 0);
    }

    return (
        <>
            <div className="h-24 bg-blue-dark text-white py-4 px-6 grid grid-cols-2 content-center overflow-hidden">
                <div className='flex justify-start items-center h-24'>
					<Link href='/'>
						<Image src={logoWhite} alt="Logo" width={200} height="auto"/>
					</Link>
                </div>
                <div className='flex items-center gap-5 col-end-5 px-8'>
                    {user.account ? (
                        <div className='flex items-center gap-5 font-semibold'>
                            <div>
                                <FaCircleUser size={30} />
                            </div>
                            <div>
                                Lv. {user.level}
                            </div>
                            <div>
                                {user.nickname}
                            </div>
                            <div className='relative cursor-pointer' style={{ transform: `rotate(${arrowRotation}deg)`, transition: 'transform 0.4s' }}>
                                <BiSolidDownArrow onClick={menuToggle} />
                            </div>
                            <div className="
                                absolute 
                                top-16 
                                right-14 
                                overflow-hidden 
                                bg-white 
                                text-black 
                                rounded 
                                shadow-md 
                                transition-opacity 
                                duration-400 
                                ease-out"
                                style={{ opacity: isMenuOpen ? 1 : 0}}
                                >
                                <ul className="text-center">
                                    <Link href='/mypage'>
                                        <li className="
                                            flex 
                                            justify-center 
                                            items-center 
                                            gap-2
                                            border-b 
                                            p-4 
                                            hover:bg-gray-300 
                                            transition 
                                            duration-300 
                                            cursor-pointer">
                                            <BiSolidUser size={20} />
                                            Profile
                                        </li>
                                    </Link>
                                    <Link href='/posts/create'>
                                        <li className="
                                            flex 
                                            justify-center 
                                            items-center 
                                            gap-2
                                            border-b 
                                            p-4 
                                            hover:bg-gray-300 
                                            transition 
                                            duration-300 
                                            cursor-pointer">
                                            <IoMdCreate size={20} />
                                            Write
                                        </li>
                                    </Link>
                                    <Link href='/nft/create'>
                                        <li className="
                                            flex 
                                            justify-center 
                                            items-center 
                                            gap-2
                                            border-b 
                                            p-4 
                                            hover:bg-gray-300 
                                            transition 
                                            duration-300 
                                            cursor-pointer">
                                            <IoCreateOutline size={20} />
                                            NFT Create
                                        </li>
                                    </Link>
                                    <li className="
                                        flex 
                                        justify-center 
                                        items-center 
                                        gap-2
                                        p-4 
                                        hover:bg-gray-300 
                                        transition 
                                        duration-300 
                                        cursor-pointer">
                                        <FiLogOut size={20} />
                                        LogOut
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='
                                flex 
                                items-center 
                                gap-2 
                                font-semibold 
                                border 
                                border-solid 
                                rounded 
                                p-2 
                                hover:bg-white 
                                hover:text-black 
                                transition-all 
                                duration-300
                                cursor-pointer'>
                                <FiLogIn size={20} />
                                <Link href='/signin'>
                                    <button>Sign In</button>
                                </Link>
                            </div>
                            <div className='
                                flex 
                                items-center 
                                gap-2 
                                font-semibold 
                                border 
                                border-solid 
                                rounded 
                                p-2 
                                hover:bg-white 
                                hover:text-black 
                                transition-all 
                                duration-300
                                cursor-pointer'>
                                <AiOutlineUserAdd size={20} />
                                <Link href='/signup'>
                                    <button>Sign Up</button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}


export default Header;