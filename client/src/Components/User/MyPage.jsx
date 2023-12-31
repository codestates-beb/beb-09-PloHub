import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import cookie from 'cookie';
import Web3 from 'web3';
import { logoBlack, ModalLayout } from '../Reference'
import TokenSwapModal from './TokenSwapModal';
import TokenSendModal from './TokenSendModal';
import { SET_EMAIL,
    SET_ADDRESS,
    SET_NICKNAME, 
    SET_LEVEL, 
    SET_TOKEN_BALANCE, 
    SET_DAILY_TOKEN_BALANCE,
    SET_ETH_BALANCE } from '../Redux/ActionTypes';


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
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [postInfo, setPostInfo] = useState([]);
    const [nftInfo, setNftInfo] = useState([]);

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

            if (response.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('닉네임이 변경되었습니다.');
    
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.reload();
                }, 3000);
            }

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

            const { user_info, posts, nfts } = response.data;
            setPostInfo(posts);
            setNftInfo(nfts);
            const ethAmount = web3Provider.utils.fromWei(user_info.eth_amount, 'ether');

            dispatch({ type: SET_EMAIL, payload: user_info.email });
            dispatch({ type: SET_ADDRESS, payload: user_info.address });
            dispatch({ type: SET_NICKNAME, payload: user_info.nickname });
            dispatch({ type: SET_LEVEL, payload: user_info.level });
            dispatch({ type: SET_TOKEN_BALANCE, payload: user_info.token_amount });
            dispatch({ type: SET_DAILY_TOKEN_BALANCE, payload: user_info.daily_token });
            dispatch({ type: SET_ETH_BALANCE, payload: ethAmount});
            
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    }

    useEffect(() => {
        myPageInfo();
    }, [])

    /**
     * 토큰 교환 혹은 토큰 전송 모달을 열기 위한 함수
     * 해당 함수는 'tokenSwap' 혹은 'tokenSend'의 두 가지 modalType 중 하나를 인자로 받음
     * 
     * modalType이 'tokenSwap'인 경우, 토큰 교환에 대한 모달을 연 후, 모달의 제목을 '토큰 교환'으로 설정하고
     * 모달의 본문에는 'TokenSwapModal' 컴포넌트를 렌더링
     * 
     * modalType이 'tokenSend'인 경우, 토큰 전송에 대한 모달을 열고, 모달의 제목을 '토큰 전송'으로 설정하며
     * 모달의 본문에는 'TokenSendModal' 컴포넌트를 렌더링
     * 
     * @param {string} modalType - 열 모달의 타입 ('tokenSwap' 혹은 'tokenSend')
     */
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
                                <p>{user.nickname?.length >= 8 ? user.nickname.slice(0, 8) + '...' + user.nickname.slice(-5) : user.nickname}</p>
                                <p>|</p>
                                <p>Lv. {user.level}</p>
                            </>
                        )}
                        </div>
                        <div className='w-[45rem] flex gap-12 justify-center font-bold text-2xl'>
                            <p>My Token : {user.tokenBalance} PH</p>
                            <p>
                                My ETH : {user.ethBalance ? Number(user.ethBalance).toFixed(6) : 0} ETH
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
                            {postInfo.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">작성한 게시글이 없습니다.</td>
                                </tr>
                            ) : (
                                postInfo.map((post) => (
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
                                ))
                            )}
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
                        {nftInfo?.length === 0 ? (
                            <div>
                                보유 및 판매 중인 NFT가 없습니다.
                            </div>
                        ) : (
                            nftInfo?.map((item) => {
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
                                            onClick={() => router.push(`/nft/${item.token_id}`)}>
                                            <div className='border-b-2' style={{position: "relative", height: "0", paddingBottom: "100%"}}>
                                                <Image 
                                                    className='rounded-t-3xl'
                                                    src={item.image} 
                                                    layout='fill'
                                                    objectFit='cover' 
                                                    alt='nft image' 
                                                />
                                            </div>
                                            <div className='p-6'>
                                                <div className="mb-4">
                                                    <h2 className="text-xl font-bold hover:underline">{item.name}</h2>
                                                </div>
                                                <p className="text-gray-700 font-semibold">{item.price} PH</p>
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
                                            <div className='border-b-2' style={{position: "relative", height: "0", paddingBottom: "100%"}}>
                                                <Image 
                                                    className='rounded-t-3xl'
                                                    src={item.image} 
                                                    layout='fill'
                                                    objectFit='cover' 
                                                    alt='nft image' 
                                                />
                                            </div>
                                            <div className='p-6'>
                                                <div className="mb-4">
                                                    <Link href='/nft/detail/:id'>
                                                        <h2 className="text-xl font-bold hover:underline">{item.name}</h2>
                                                    </Link>
                                                </div>
                                                <p className="text-gray-700 font-semibold">{item.price} PH</p>
                                            </div>
                                        </div>
                                    )
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default MyPage;