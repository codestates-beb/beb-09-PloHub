import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { format } from 'date-fns'
import DefaultLayout from '../Components/Layout/DefaultLayout'
import Nav from '../Components/Nav/Nav';



export default function Home() {
    const user = useSelector((state) => state.user);
    console.log(user)

    const [currentPage, setCurrentPage] = useState(1);
    const [currentItems, setCurrentItems] = useState([]); // currentItems를 state로 변경해주세요.

    const router = useRouter();
    const currentDate = new Date();

    const formatDate = format(currentDate, 'yyyy-MM-dd');

    const postsPerPage = 10;
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
        { id: 11, category: 'all', title: 'Post 11', content: 'Author 11', writer: 'test', date: formatDate },
        { id: 12, category: 'all', title: 'Post 12', content: 'Author 12', writer: 'test', date: formatDate },
        { id: 13, category: 'all', title: 'Post 13', content: 'Author 13', writer: 'test', date: formatDate },
        { id: 14, category: 'all', title: 'Post 14', content: 'Author 14', writer: 'test', date: formatDate },
        { id: 15, category: 'all', title: 'Post 15', content: 'Author 15', writer: 'test', date: formatDate },
        { id: 16, category: 'all', title: 'Post 16', content: 'Author 16', writer: 'test', date: formatDate },
        { id: 17, category: 'all', title: 'Post 17', content: 'Author 17', writer: 'test', date: formatDate },
        { id: 18, category: 'all', title: 'Post 18', content: 'Author 18', writer: 'test', date: formatDate },
        { id: 19, category: 'all', title: 'Post 19', content: 'Author 19', writer: 'test', date: formatDate },
        { id: 20, category: 'all', title: 'Post 20', content: 'Author 20', writer: 'test', date: formatDate },
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
        <DefaultLayout>
            <Nav />
            <div className='flex justify-center items-center w-full min-h-screen overflow-hidden'>
                <div className={
                    `w-8/12 
                    h-full
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
                            <button type="button"onClick={(e) => {
                                // user가 없는 경우 (로그인하지 않은 상태)
                                if (user.account.length === 0) {
                                    // 클릭 이벤트를 취소하고
                                    e.preventDefault();
                                    // 알림을 표시합니다
                                    alert("로그인이 필요합니다.");
                                }
                            }}>
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
                            {currentItems.map((post) => (
                                <tr className="
                                    hover:bg-gray-200 
                                    transition-all 
                                    duration-300 
                                    cursor-pointer"
                                    onClick={() => router.push(`/posts/${post.id}`)}>
                                    <td className="border-b p-6">
                                        <p className="text-xl font-semibold">{post.id}</p>
                                    </td>
                                    <td className="border-b p-6">
                                        <p className="text-gray-600"> {post.category}</p>
                                    </td>
                                    <td className="border-b p-6">
                                        <p className="text-gray-600"> {post.title}</p>
                                    </td>
                                    <td className="border-b p-6">
                                        <p className="text-gray-600"> {post.content}</p>
                                    </td>
                                    <td className="border-b p-6">
                                        <p className="text-gray-600"> {post.writer}</p>
                                    </td>
                                    <td className="border-b p-6">
                                        <p className="text-gray-600"> {post.date}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='w-full mt-16 flex justify-center'>
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

        </DefaultLayout>
    )
}