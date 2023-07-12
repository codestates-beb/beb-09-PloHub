import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_NICKNAME } from '../Redux/ActionTypes';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import cookie from 'cookie';
import Web3 from 'web3';
import { logoBlack, ModalLayout } from '../Reference'
import TokenSwapModal from './TokenSwapModal';
import TokenSendModal from './TokenSendModal';

const MyPage = () => {
    const router = useRouter();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    let provider;
    let web3Provider;
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        provider = window.ethereum;
        web3Provider = new Web3(provider);
      }
    } catch (e) {
      console.log(e);
    }
    

    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user.nickname);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('owned');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [userInfo, setUserInfo] = useState();
    const [postInfo, setPostInfo] = useState([]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const nicknameEdit = () => {
        setIsEditing(true);
    };

    /**
     * 닉네임을 변경하는 함수
     * 입력한 닉네임을 백엔드 서버로 전송하여 변경
     * 변경된 닉네임을 리덕스 스토어와 상태(State)에 업데이트하고 페이지를 새로고침
     */
    const changeNickname = async () => {
        const formData = new FormData();

        formData.append('nickname', nickname);

        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/change-nickname`, formData, {
                withCredentials: true
            });

            dispatch({ type: SET_NICKNAME, payload: nickname });

            setIsModalOpen(true);
            setModalTitle('Success');
            setModalBody('닉네임이 변경되었습니다.');

            setTimeout(() => {
                setIsModalOpen(false);
                router.reload();
            }, 3000);
        } catch (error) {
            console.log('Error: ' + error.message);
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody(error.message);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    };

    /**
     * 닉네임을 유효성 검사하는 함수
     * 입력한 닉네임이 유효한지 확인하고, 유효하지 않은 경우 에러 메시지를 설정 
     */
    const validateNickname = () => {
        if (nickname.length < 2) {
            setErrorMessage('닉네임은 최소 2자 이상이어야 합니다.');
        } else if (nickname.length > 8) {
            setErrorMessage('닉네임은 최대 8자 입니다.');
        } else {
            setErrorMessage('');
        }
    };

    useEffect(() => {
        validateNickname();
    }, [nickname])

    const postsPerPage = 5;

    const nfts = [
        { id: 1, file: logoBlack, title: 'Card Title1', content: '', price: '1'},
        { id: 2, file: logoBlack, title: 'Card Title2', content: '', price: '2'},
        { id: 3, file: logoBlack, title: 'Card Title3', content: '', price: '3'},
    ]

    /**
     * 페이지 변경 핸들러 함수
     * 선택한 페이지 번호를 받아와서 현재 페이지 상태(State)를 업데이트함
     * @param {number} pageNumber 선택한 페이지 번호
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    /**
     * 전체 페이지 수를 계산하는 함수
     */
    useEffect(() => {
        // currentPage가 바뀔 때마다 실행되도록 설정
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
    }, [currentPage]); // currentPage를 dependency로 추가해주세요.


    // Calculate total pages
    const totalPages = Math.ceil(postInfo.length / postsPerPage);

    /**
     * 사용자 정보를 가져오는 함수
     * 백엔드 서버에 GET 요청을 보내어 사용자 정보와 게시물 정보를 가져옴
     * 가져온 정보를 적절한 상태(State)로 업데이트하고, 리덕스 스토어에도 해당 정보를 저장
     */
    const myPageInfo = async () => {
        const token = cookie.parse(document.cookie || '');

        try {
            let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/mypage`, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`
                },
                withCredentials: true
            });

            const { user_info, posts } = response.data;
            console.log(response);
            setUserInfo(user_info);
            setPostInfo(posts);

            dispatch({ type: SET_EMAIL, payload: userInfo.email });
            dispatch({ type: SET_ADDRESS, payload: userInfo.address });
            dispatch({ type: SET_NICKNAME, payload: userInfo.nickname });
            dispatch({ type: SET_LEVEL, payload: userInfo.level });
            dispatch({ type: SET_TOKEN_BALANCE, payload: userInfo.token_amount });
            dispatch({ type: SET_DAILY_TOKEN_BALANCE, payload: userInfo.daily_token });
            dispatch({ type: SET_ETH_BALANCE, payload: userInfo.eth_amount });
            
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    }

    useEffect(() => {
        myPageInfo();
    }, [])

    const openTokenSendModal = (modalType) => {
        if (modalType === 'tokenSwap') {
            setIsModalOpen(true);
            setModalTitle('토큰 교환');
            setModalBody(<TokenSwapModal setIsModalOpen={setIsModalOpen} />);
        } else if (modalType === 'tokenSend') {
            setIsModalOpen(true);
            setModalTitle('토큰 전송');
            setModalBody(<TokenSendModal setIsModalOpen={setIsModalOpen} />);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='flex flex-col gap-6 mx-auto w-[90%] min-h-screen p-4'>
                <div className='w-full border-b border-gray-300 mx-auto my-6'>
                    <div className='grid grid-cols-3 items-center py-3 px-5 text-center'>
                        <div className='flex gap-4 font-bold text-2xl pl-3'>
                        {isEditing ? (
                            <div className='flex items-center justify-start gap-3'>
                                <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="border rounded-xl px-2 py-1 w-32"
                                />
                                <p className='font-normal text-xs text-red-500'>{errorMessage}</p>
                            </div>
                        ) : (
                            <>
                                <p>{userInfo?.nickname?.length >= 8 ? userInfo?.nickname.slice(0, 8) + '...' + userInfo.nickname.slice(-5) : userInfo?.nickname}</p>
                                <p>|</p>
                                <p>Lv. {userInfo?.level}</p>
                            </>
                        )}
                        </div>
                        <div className='w-[45rem] flex gap-12 justify-center font-bold text-2xl'>
                            <p>My Token : {userInfo?.token_amount} PH</p>
                            <p>
                                My ETH : {userInfo?.eth_amount ? web3Provider.utils?.fromWei(Number(userInfo.eth_amount), 'ether') : 0} ETH
                                {/* My ETH : {web3Provider?.utils?.fromWei(userInfo?.eth_amount, 'ether')} ETH */}
                            </p>
                        </div>
                        <div className='flex gap-5 justify-end font-bold text-xl'>
                            {isEditing ? (
                                <button className='
                                    border 
                                    rounded-xl 
                                    p-3 
                                    text-white 
                                    bg-yellow-500 
                                    hover:bg-yellow-600 
                                    transition 
                                    duration-300' 
                                    type="button"
                                    onClick={changeNickname}
                                    disabled={errorMessage !== ''}
                                    >닉네임 저장</button>
                            ) : (
                                <button className='
                                    border 
                                    rounded-xl 
                                    p-3 
                                    text-white 
                                    bg-yellow-500 
                                    hover:bg-yellow-600 
                                    transition 
                                    duration-300' 
                                    type="button"
                                    onClick={nicknameEdit}
                                    >
                                        닉네임 변경
                                    </button>
                            )}
                            <button className='
                                border 
                                rounded-xl 
                                p-3 
                                text-white 
                                bg-yellow-500 
                                hover:bg-yellow-600 
                                transition 
                                duration-300' 
                                type="button"
                                onClick={() => openTokenSendModal('tokenSwap')}>
                                토큰 교환
                            </button>
                            <button className='
                                border 
                                rounded-xl 
                                p-3 
                                text-white 
                                bg-yellow-500 
                                hover:bg-yellow-600 
                                transition 
                                duration-300' 
                                type="button"
                                onClick={() => openTokenSendModal('tokenSend')}>
                                토큰 전송
                            </button>
                        </div>
                    </div>
                </div>
                <div className='mb-12'>
                    <div className='mb-4'>
                        <p className='font-bold text-2xl'>작성한 게시글</p> 
                    </div>
                    <div>
                        <table className="w-full text-center border-collapse ">
                            <thead className='border-b'>
                                <tr>
                                    <th className="p-4">No.</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Content</th>
                                    <th className="p-4">Writer</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postInfo.map((post) => (
                                <tr 
                                    key={post.id} 
                                    className="hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                                    onClick={() => router.push(`/posts/${post.id}`)}>
                                    <td className="border-b p-3">
                                        <p className="text-xl font-semibold">{post.id}</p>
                                    </td>
                                    <td className="border-b p-3">
                                        <p className="text-gray-600"> {post.category}</p>
                                    </td>
                                    <td className="border-b p-3">
                                        <p className="text-gray-600"> {post.title}</p>
                                    </td>
                                    <td className="border-b p-3">
                                        <p className="text-gray-600"> {post.content}</p>
                                    </td>
                                    <td className="border-b p-3">
                                        <p className="text-gray-600"> {post.author.nickname}</p>
                                    </td>
                                    <td className="border-b p-3">
                                        <p className="text-gray-600"> {post.created_at.split('T')[0]}<br />{post.created_at.substring(11,19)}</p>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='w-full mt-10 flex justify-center'>
                        <div className='flex items-center'>
                            {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`px-2 py-2 mx-1 ${
                                currentPage === i + 1 ? 'font-bold' : ''
                                }`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='my-12'>
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            className={`text-2xl ${
                                activeTab === 'owned' ? 'text-black font-bold' : 'text-gray-500'
                            }`}
                            onClick={() => handleTabChange('owned')}
                            >
                            보유중 NFT
                        </button>
                        <div className='font-bold'> | </div>
                        <button
                            className={`text-2xl ${
                                activeTab === 'selling' ? 'text-black font-bold' : 'text-gray-500'
                            }`}
                            onClick={() => handleTabChange('selling')}
                            >
                            판매중 NFT
                        </button>
                    </div>
                    <div className='flex items-center gap-10'>
                        {nfts.map((item) => {
                            return (
                                activeTab === 'owned' ? (
                                    <div className="
                                        w-[15%] 
                                        bg-white 
                                        shadow-lg 
                                        border 
                                        rounded-3xl 
                                        transform 
                                        transition-transform 
                                        duration-300 
                                        hover:-translate-y-2 
                                        cursor-pointer"
                                        key={item.id}
                                        onClick={() => router.push(`/nft/${item.id}`)}>
                                        <div className='border-b-2'>
                                            <Image src={item.file} width={'100%'} height={'100%'} />
                                        </div>
                                        <div className='p-6'>
                                            <div className="mb-4">
                                                <Link href='/nft/detail/:id'>
                                                    <h2 className="text-xl font-bold hover:underline">{item.title}</h2>
                                                </Link>
                                            </div>
                                            <p className="text-gray-700 font-semibold">{item.price} ETH</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="
                                        w-[15%] 
                                        bg-white 
                                        shadow-lg 
                                        border 
                                        rounded-3xl 
                                        transform 
                                        transition-transform 
                                        duration-300 
                                        hover:-translate-y-2 
                                        cursor-pointer"
                                        key={item.id}
                                        onClick={() => router.push(`/nft/${item.id}`)}>
                                        <div className='border-b-2'>
                                            <Image src={item.file} width={'100%'} height={'100%'} />
                                        </div>
                                        <div className='p-6'>
                                            <div className="mb-4">
                                                <Link href='/nft/detail/:id'>
                                                    <h2 className="text-xl font-bold hover:underline">{item.title}</h2>
                                                </Link>
                                            </div>
                                            <p className="text-gray-700 font-semibold">{item.price} ETH</p>
                                        </div>
                                    </div>
                                )
                            )
                        })}
                    </div>
                </div>
            </div>
            {isModalOpen && modalType === 'tokenSwap' && (
                <TokenSwapModal closeModal={closeModal} />
            )}
            {isModalOpen && modalType === 'tokenSend' && (
                <TokenSendModal closeModal={closeModal} />
            )}
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default MyPage;