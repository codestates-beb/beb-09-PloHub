import React from 'react'
import { format } from 'date-fns'
import DefaultLayout from '../Components/Layout/DefaultLayout'
import Nav from '../Components/Nav/Nav';



export default function Home() {

    const currentDate = new Date();

    const formatDate = format(currentDate, 'yyyy-MM-dd');

    const posts = [
        { id: 1, category: 'all', title: 'Post 1', content: 'Author 1', writer: 'test', date: formatDate },
        { id: 2, category: 'all', title: 'Post 2', content: 'Author 2', writer: 'test', date: formatDate },
        { id: 3, category: 'all', title: 'Post 3', content: 'Author 3', writer: 'test', date: formatDate },
        { id: 4, category: 'all', title: 'Post 4', content: 'Author 4', writer: 'test', date: formatDate },
        { id: 5, category: 'all', title: 'Post 5', content: 'Author 5', writer: 'test', date: formatDate },
        { id: 6, category: 'all', title: 'Post 6', content: 'Author 6', writer: 'test', date: formatDate },
        { id: 7, category: 'all', title: 'Post 7', content: 'Author 7', writer: 'test', date: formatDate },
        { id: 8, category: 'all', title: 'Post 8', content: 'Author 8', writer: 'test', date: formatDate },
        { id: 9, category: 'all', title: 'Post 9', content: 'Author 8', writer: 'test', date: formatDate },
        { id: 10, category: 'all', title: 'Post 10', content: 'Author 8', writer: 'test', date: formatDate },
    ];

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
                        <button className='
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
                            text-md' 
                            type="button">
                            글쓰기
                        </button>
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
                            {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-200 transition-all duration-300 cursor-pointer">
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
                        페이지네이션 자리
                    </div>
                    <div className='w-full mt-16 mb-5 flex justify-center items-center'>
                        <select class="border border-black py-2 px-4 pr-6 rounded mr-5 text-sm">
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
