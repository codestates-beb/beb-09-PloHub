import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns'
import { Header, Footer, logoBlack } from '../Components/Reference'

const mypage = () => {

    const currentDate = new Date();

    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState('Test');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItems, setCurrentItems] = useState([]); // currentItems를 state로 변경해주세요.


    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleEditButtonClick = () => {
        setIsEditing(true);
    };

    const handleSaveButtonClick = () => {
        setIsEditing(false);
        // Perform save logic here
    };

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



    return (
        <>
            <Header />
            <div className='flex flex-col justify-center gap-6 mx-auto w-[90%]'>
                <div className='w-full border-b rounded-lg border-gray-300 mx-auto my-6'>
                    <div className='grid grid-cols-3 items-center py-3 px-5 text-center'>
                        <div className='flex gap-4 font-bold text-2xl pl-5'>
                        {isEditing ? (
                            <input
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            className="border rounded-xl px-2 py-1 w-32"
                            />
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
                        <div className='text-right font-bold text-xl'>
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
                                onClick={handleSaveButtonClick}
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
                                onClick={handleEditButtonClick}
                                >닉네임 변경</button>
                        )}
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
                                <tr key={post.id} className="hover:bg-gray-200 transition-all duration-300 cursor-pointer">
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
                                className={`px-4 py-2 mx-1 rounded ${
                                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
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
                    <div className='mb-6'>
                        <p className='font-bold text-2xl'>보유한 NFT</p>
                    </div>
                    <div className=''>
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
                            cursor-pointer">
                            <div className='border-b-2'>
                                <Image src={logoBlack} width={'100%'} height={'100%'} />
                            </div>
                            <div className='p-6'>
                                <div className="mb-4">
                                    <Link href='/nft/detail/:id'>
                                        <h2 className="text-xl font-bold hover:underline">Card Title</h2>
                                    </Link>
                                </div>
                                <p className="text-gray-700 font-semibold">1 ETH</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default mypage;