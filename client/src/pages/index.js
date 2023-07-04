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
            <div className='flex justify-center w-full overflow-hidden'>
                <Nav />
                <div className={
                    `mx-auto 
                    w-8/12  
                    h-full 
                    my-7
                    `
                }>
                    <div className='w-full flex justify-end'>
                        <button className='
                            border 
                            rounded-2xl 
                            p-3 
                            w-1/12 
                            mb-5 
                            bg-blue-dark 
                            text-white 
                            font-semibold 
                            hover:bg-blue-main 
                            transition-all 
                            duration-300 
                            text-lg' 
                            type="button">
                            글쓰기
                        </button>
                    </div>
                    {/* <div className="flex flex-col space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="border p-4 rounded shadow hover:bg-gray-200 transition-all duration-300 cursor-pointer">
                                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                                <p className="text-gray-600">Written by {post.author}</p>
                            </div>
                        ))}
                    </div> */}
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
                                <td className="border-b p-4">
                                    <p className="text-xl font-semibold">{post.id}</p>
                                </td>
                                <td className="border-b p-4">
                                    <p className="text-gray-600"> {post.category}</p>
                                </td>
                                <td className="border-b p-4">
                                    <p className="text-gray-600"> {post.title}</p>
                                </td>
                                <td className="border-b p-4">
                                    <p className="text-gray-600"> {post.content}</p>
                                </td>
                                <td className="border-b p-4">
                                    <p className="text-gray-600"> {post.writer}</p>
                                </td>
                                <td className="border-b p-4">
                                    <p className="text-gray-600"> {post.date}</p>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    <div className='w-full mt-20 flex justify-center'>
                        페이지네이션 자리
                    </div>
                    <div className='w-full mt-20 flex justify-center items-center'>
                        <div className='mr-12'>
                            옵션
                        </div>
                        <input className='border rounded-lg border-black py-3 px-4 w-5/12' type="text" placeholder='검색'/>
                        <div className='ml-12'>
                            <button type="button">검색</button>
                        </div>
                    </div>
                </div>
            </div>

        </DefaultLayout>
    )
}
