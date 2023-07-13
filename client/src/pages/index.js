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

    const postsPerPage = 10;

    /**
     * 페이지네이션을 위한 페이지 변경 이벤트를 처리
     * 제공된 페이지 번호로 현재 페이지를 설정하고
     * 새 페이지 번호를 라우터의 쿼리에 푸시
     * 
     * @param {number} pageNumber - 새 페이지 번호.
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        router.push({
            pathname: '/',
            query: { page: pageNumber, limit: 10, category }
        })
    };

    // 페이지네이션을 위한 총 페이지 수를 계산
    // 총 페이지 수는 게시물 목록의 길이를 페이지 당 게시물 수로 나눈 값(올림)
    const totalPages = Math.ceil(postList?.length / postsPerPage);
    
    /**
     * 현재 페이지 변경을 처리하기 위한 훅
     * 이것은 새 페이지의 첫 번째와 마지막 게시물의 인덱스를 계산
     * 이 값들은 새 페이지의 게시물 목록을 분할하는 데 사용될 수 있음
     */
    useEffect(() => {
        // currentPage가 바뀔 때마다 실행되도록 설정
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
    }, [currentPage]); // currentPage를 dependency로 추가해주세요.

    /**
     * 행동을 진행하기 전에 사용자가 로그인했는지 확인
     * 사용자가 로그인하지 않은 경우, 기본 동작을 방지하고 사용자에게 알리는 모달을 띄움
     *
     * @param {Event} e - 로그인 확인을 트리거한 이벤트.
     */
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
                            {postList?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">등록된 게시글이 없습니다.</td>
                                </tr>
                            ) : (
                                postList?.map((post) => (
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

/**
 * 서버 사이드 렌더링(SSR)을 위한 함수
 * 페이지, 제한값, 카테고리를 쿼리 파라미터로 받아 백엔드에서 게시물 리스트를 가져옴
 * 
 * @param {object} context - Next.js의 context 객체. 쿼리 파라미터 등 서버 사이드 렌더링에 필요한 정보를 담고 있음
 * @returns {object} props - 컴포넌트로 전달될 props. 게시물 리스트를 포함
 */
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
    
        const postList = res.data.posts;

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