import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FaCircleUser } from 'react-icons/fa6';
import { BiSolidDownArrow, BiSolidUser } from 'react-icons/bi';
import { IoMdCreate } from 'react-icons/io';
import { IoCreateOutline } from 'react-icons/io5';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { logoWhite } from '../Reference';
import { SET_EMAIL,
    SET_ADDRESS,
    SET_NICKNAME, 
    SET_LEVEL, 
    SET_TOKEN_BALANCE, 
    SET_DAILY_TOKEN_BALANCE,
    SET_ETH_BALANCE } from '../Redux/ActionTypes';
import { ModalLayout } from '../Reference';

const Header = () => {
    const { user } = useSelector((state) => state);
    const dispatch = useDispatch();
    const router = useRouter();

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [arrowRotation, setArrowRotation] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const menuToggle = () => {
        setMenuOpen(!isMenuOpen);
        setArrowRotation(arrowRotation + 180);
    }
    
    const userInfo = async () => {
        const accessToken = localStorage.getItem('accessToken');
        
        try {
            let response = await axios.get('http://localhost:4000/api/v1/users/myinfo', {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                // 서버로부터 받은 사용자 정보
                const { email, nickname, level, address, eth_amount, token_amount, daily_token } = response.data.user_info;
                console.log(response.data);

                console.log('email: ' + email);
                console.log('address: ' + address);
                console.log('nickname: ' + nickname);
                console.log('level: ' + level);
                console.log('token: ' + token_amount);
                console.log('daily: ' + daily_token);
                console.log('eth_amount: ' + eth_amount);

                dispatch({ type: SET_EMAIL, payload: email });
                dispatch({ type: SET_ADDRESS, payload: address });
                dispatch({ type: SET_NICKNAME, payload: nickname });
                dispatch({ type: SET_LEVEL, payload: level });
                dispatch({ type: SET_TOKEN_BALANCE, payload: token_amount });
                dispatch({ type: SET_DAILY_TOKEN_BALANCE, payload: daily_token });
                dispatch({ type: SET_ETH_BALANCE, payload: eth_amount });
            }
        } catch (error) {
            console.error("Failed to fetch user info: ", error);
        }
    }

    useEffect(() => {
        userInfo();
    }, []);

    const logOut = async () => {
        try {
            let response = await axios.post('http://localhost:4000/api/v1/users/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                withCredentials: true
            });
            if (response.data.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('로그아웃 되었습니다.');

                localStorage.removeItem('accessToken');

                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/');
                    router.reload();
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody(error.message);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
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
                    {user.email ? (
                        <div className='flex items-center gap-5 font-semibold'>
                            <div>
                                <FaCircleUser size={30} />
                            </div>
                            <div>
                                Lv. {user.level}
                            </div>
                            <div>
                                {user.nickname.length >= 8 ? user.nickname.slice(0, 8) + '...' + user.nickname.slice(-5) : user.nickname}
                            </div>
                            <div className='relative cursor-pointer' style={{ transform: `rotate(${arrowRotation}deg)`, transition: 'transform 0.4s' }}>
                                <BiSolidDownArrow onClick={menuToggle} />
                            </div>
                            {isMenuOpen &&
                                <div className="
                                    absolute 
                                    top-16 
                                    right-14 
                                    overflow-hidden 
                                    bg-white 
                                    text-black 
                                    rounded 
                                    shadow-md"
                                    >
                                    <ul className="text-center">
                                        <Link href='/users/mypage'>
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
                                            cursor-pointer"
                                            onClick={logOut}>
                                            <FiLogOut size={20} />
                                            LogOut
                                        </li>
                                    </ul>
                                </div>
                            }
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
                                <Link href='/users/signin'>
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
                                <Link href='/users/signup'>
                                    <button>Sign Up</button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    );
}


export default Header;