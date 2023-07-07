import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_NICKNAME } from '../Redux/ActionTypes';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowCircleDown, FaEthereum, FaAddressCard } from 'react-icons/fa'
import { format } from 'date-fns';
import { logoBlack, ploHub, ModalLayout } from '../Reference'

const MyPage = () => {
    const router = useRouter();
    const currentDate = new Date();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState('Test');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);
    const [activeTab, setActiveTab] = useState('owned');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    const nicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const nicknameEdit = () => {
        setIsEditing(true);
    };

    const nicknameSave = () => {
        setIsEditing(false);
        dispatch({ type: SET_NICKNAME, payload: nickname });
    };

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

    const formatDate = format(currentDate, 'yyyy-MM-dd');

    const postsPerPage = 5;
    const posts = [
        { id: 1, category: 'all', title: 'Post 1', content: 'Author 1', writer: 'test', date: formatDate },
        { id: 2, category: 'all', title: 'Post 2', content: 'Author 2', writer: 'test', date: formatDate },
        { id: 3, category: 'all', title: 'Post 3', content: 'Author 3', writer: 'test', date: formatDate },
        { id: 4, category: 'all', title: 'Post 4', content: 'Author 4', writer: 'test', date: formatDate },
        { id: 5, category: 'all', title: 'Post 5', content: 'Author 5', writer: 'test', date: formatDate },
        { id: 6, category: 'all', title: 'Post 6', content: 'Author 6', writer: 'test', date: formatDate },
        { id: 7, category: 'all', title: 'Post 7', content: 'Author 7', writer: 'test', date: formatDate },
        { id: 8, category: 'all', title: 'Post 8', content: 'Author 8', writer: 'test', date: formatDate },
        { id: 9, category: 'all', title: 'Post 9', content: 'Author 9', writer: 'test', date: formatDate },
        { id: 10, category: 'all', title: 'Post 10', content: 'Author 10', writer: 'test', date: formatDate },
        { id: 11, category: 'all', title: 'Post 8', content: 'Author 8', writer: 'test', date: formatDate },
        { id: 12, category: 'all', title: 'Post 9', content: 'Author 9', writer: 'test', date: formatDate },
        { id: 13, category: 'all', title: 'Post 10', content: 'Author 10', writer: 'test', date: formatDate },
        { id: 14, category: 'all', title: 'Post 8', content: 'Author 8', writer: 'test', date: formatDate },
        { id: 15, category: 'all', title: 'Post 9', content: 'Author 9', writer: 'test', date: formatDate },
        { id: 16, category: 'all', title: 'Post 10', content: 'Author 10', writer: 'test', date: formatDate },
        { id: 17, category: 'all', title: 'Post 8', content: 'Author 8', writer: 'test', date: formatDate },
        { id: 18, category: 'all', title: 'Post 9', content: 'Author 9', writer: 'test', date: formatDate },
        { id: 19, category: 'all', title: 'Post 10', content: 'Author 10', writer: 'test', date: formatDate },
    ];

    const nfts = [
        { id: 1, file: logoBlack, title: 'Card Title1', content: '', price: '1'},
        { id: 2, file: logoBlack, title: 'Card Title2', content: '', price: '2'},
        { id: 3, file: logoBlack, title: 'Card Title3', content: '', price: '3'},
    ]

    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    useEffect(() => {
        // currentPage가 바뀔 때마다 실행되도록 설정
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        setCurrentItems(posts.slice(indexOfFirstPost, indexOfLastPost));
    }, [currentPage]); // currentPage를 dependency로 추가해주세요.


    // Calculate total pages
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const myPageInfo = async () => {
        try {
            let response = await axios.get('http://localhost:4000/api/v1/users/mypage', );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const tokenSwapLayoutHtml = () => {
        const handleTokenAmountChange = (e) => {
            // ERC-20 수량 변경 시 처리 로직
        };
    
        const handleEthAmountChange = (e) => {
            // ETH 수량 변경 시 처리 로직
        };
    
        return (
            <>
                <form className='
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
                            type="number" 
                            onChange={handleTokenAmountChange} />
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
                            onChange={handleEthAmountChange} />
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
                            onClick={() => setModalOpen(false)}>
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
                            type='submit'>
                            전송
                        </button>
                    </div>
                </form>
    
            </>
        );
    }

    const tokenSendLayoutHtml = () => {
    
        return (
            <>
                <form className='
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
                            type="text" />
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
                            type="number" />
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
                            onClick={() => setModalOpen(false)}>
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
                            type='submit'>
                            전송
                        </button>
                    </div>
                </form>
    
            </>
        );
    }

    const openTokenSendModal = (e) => {
        const btnType = e.target.innerText;
        if (btnType === '토큰 교환') {
            setModalOpen(true);
            setModalTitle('토큰 교환');
            setModalBody(tokenSwapLayoutHtml);
        } else {
            setModalOpen(true);
            setModalTitle('토큰 전송');
            setModalBody(tokenSendLayoutHtml);
        }
    }

    return (
        <>
            <div className='flex flex-col justify-center gap-6 mx-auto w-[90%]'>
                <div className='w-full border-b border-gray-300 mx-auto my-6'>
                    <div className='grid grid-cols-3 items-center py-3 px-5 text-center'>
                        <div className='flex gap-4 font-bold text-2xl pl-5'>
                        {isEditing ? (
                            <div className='flex items-center justify-start gap-3'>
                                <input
                                type="text"
                                value={nickname}
                                onChange={nicknameChange}
                                className="border rounded-xl px-2 py-1 w-32"
                                />
                                <p className='font-normal text-xs text-red-500'>{errorMessage}</p>
                            </div>
                        ) : (
                            <>
                                <p>{nickname}</p>
                                <p>|</p>
                                <p>Lv.2</p>
                            </>
                        )}
                        </div>
                        <div className='flex gap-12 justify-center font-bold text-2xl'>
                            <p>My Token : 15 PH</p>
                            <p>My ETH : 0.1 ETH</p>
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
                                    onClick={nicknameSave}
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
                                onClick={openTokenSendModal}>
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
                                onClick={openTokenSendModal}>
                                토큰 전송
                            </button>
                        </div>
                    </div>
                </div>
                <div className=''>
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
                                {currentItems.map((post) => (
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
                                        <p className="text-gray-600"> {post.writer}</p>
                                    </td>
                                    <td className="border-b p-3">
                                        <p className="text-gray-600"> {post.date}</p>
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
            <ModalLayout isOpen={modalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default MyPage;