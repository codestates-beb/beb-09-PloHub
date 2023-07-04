import React, { useState } from 'react'
import DefaultLayout from '../Components/Layout/DefaultLayout'
import Nav from '../Components/Nav/Nav';
import { Toggle } from '../Components/Reference';


export default function Home() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    const posts = [
        { id: 1, title: 'Post 1', author: 'Author 1' },
        { id: 2, title: 'Post 2', author: 'Author 2' },
        { id: 3, title: 'Post 3', author: 'Author 3' },
        { id: 4, title: 'Post 4', author: 'Author 4' },
        { id: 5, title: 'Post 5', author: 'Author 5' },
    ];

    return (
        <DefaultLayout>
            <Toggle isOn={isNavOpen} handleToggle={handleToggle} />
            <Nav isOpen={isNavOpen} />
            <div className={
                `absolute 
                top-20 
                mx-auto 
                left-0 
                right-0 
                transition-all 
                duration-500 
                ease-in-out 
                w-9/12 
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
                <div className="flex flex-col space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="border p-4 rounded shadow hover:bg-gray-200 transition-all duration-300 cursor-pointer">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-600">Written by {post.author}</p>
                        </div>
                    ))}
                </div>
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
        </DefaultLayout>
    )
}
