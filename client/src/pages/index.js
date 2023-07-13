import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DefaultLayout from '../Components/Layout/DefaultLayout'
import Nav from '../Components/Nav/Nav';
import { ModalLayout } from '../Components/Reference';



export default function Home({ postList }) {
    const user = useSelector((state) => state.user);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [category, setCategory] = useState(0);

    const router = useRouter();

    // 카테고리 아이콘 매핑
    const categoryMappings = {
        0: { text: 'All' },
        1: { text: '행사 정보' },
        2: { text: '코스 정보' },
        3: { text: '참여 후기' },
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        router.push({
            pathname: '/',
            query: { page: pageNumber, limit: 10, category }
        })
    };
    
    useEffect(() => {
        router.push(`/?page=${currentPage}`);
    }, [currentPage]);

    const loginCheck = (e) => {
        
        if (user.email === '') {
            e.preventDefault();
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody('로그인이 필요합니다.');
            
            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }

    return (
        <DefaultLayout>
            <Nav />
            <div className='flex justify-center items-center w-full min-h-screen overflow-hidden'>
                <div className={
                    `w-8/12 
                    h-[70rem]
                    `
                }>
                    <div className='flex justify-end'>
                        <Link className='
                            border 
                            rounded-2xl 
                            p-3 
                            w-1/12 
                            mb-8 
                            bg-blue-dark 
                            text-white 
                            font-semibold 
                            hover:bg-blue-main 
                            transition-all 
                            duration-300 
                            text-md
                            text-center' 
                            href='/posts/create'>
                            <button type="button" onClick={loginCheck}>
                                글쓰기
                            </button>
                        </Link>
                    </div>
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
                            {postList.posts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">등록된 게시글이 없습니다.</td>
                                </tr>
                            ) : (
                                postList.posts.map((post) => (
                                    <tr className="
                                        hover:bg-gray-200 
                                        transition-all 
                                        duration-300 
                                        cursor-pointer"
                                        key={post.id}
                                        onClick={() => router.push(`/posts/${post.id}`)}>
                                        <td className="border-b p-6">
                                            <p className="text-xl font-semibold">{post.id}</p>
                                        </td>
                                        <td className="border-b p-6">
                                            <p className="text-gray-600"> 
                                                {categoryMappings[post.category].text}
                                            </p>
                                        </td>
                                        <td className="border-b p-6">
                                            <p className="text-gray-600"> {post.title}</p>
                                        </td>
                                        <td className="border-b p-6">
                                            <p className="text-gray-600"> {post.content}</p>
                                        </td>
                                        <td className="border-b p-6">
                                            <p className="text-gray-600">
                                            {post.author.nickname.length >= 8 ? post.author.nickname.slice(0, 8) + '...' + post.author.nickname.slice(-5) : post.author.nickname}
                                            </p>
                                        </td>
                                        <td className="border-b p-6">
                                            <p className="text-gray-600"> 
                                                {post.created_at.split('T')[0]}<br />{post.created_at.substring(11,19)}
                                            </p>
                                            
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className='w-full mt-16 flex justify-center'>
                        <div className='flex items-center'>
                        {Array.from({ length: postList.totalPages }, (_, i) => (
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
                    <div className='w-full mt-16 mb-5 flex justify-center items-center'>
                        <select className="border border-black py-2 px-4 pr-6 rounded mr-5 text-sm">
                            <option className="text-sm" value="option1">제목 + 내용</option>
                            <option className="text-sm" value="option2">제목</option>
                            <option className="text-sm" value="option3">내용</option>
                            <option className="text-sm" value="option3">작성자</option>
                        </select>
                        <input className='border rounded-lg border-black py-2 px-4 w-5/12' type="text" placeholder='게시글 검색'/>
                        <div className='ml-5'>
                            <button className='border rounded-lg py-2 px-6 bg-blue-dark text-white hover:bg-blue-main transition duration-300' type="button">검색</button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </DefaultLayout>
    )
}

export const getServerSideProps = async ({ query }) => {
    const page = query.page || 1; // Default page is 1
    const limit = query.limit || 10; // Default limit is 10
    const { category } = query;

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/list`, {
            params: {
            page,
            limit,
            category,
            },
            withCredentials: true
        });
    
        const postList = res.data;

        return {
            props: {
                postList,
            }
        };
        } catch (error) {
        console.error('게시물을 가져오는데 실패했습니다:', error);
    
        return {
            props: {
                postList: null,
            }
        };
    }
};