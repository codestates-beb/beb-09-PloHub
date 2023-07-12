import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ModalLayout } from '../Reference';

const PostDetail = ({ postDetail }) => {
    const user = useSelector((state) => state.user);
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [comment, setComment] = useState('');

    // 카테고리 아이콘 매핑
    const categoryMappings = {
        0: { text: 'All' },
        1: { text: '행사 정보' },
        2: { text: '코스 정보' },
        3: { text: '참여 후기' },
    };

    const isAuthor = user && user.email === postDetail.post_info.author.email;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: postDetail.media.length > 2 ? 3 : postDetail.media.length,
        slidesToScroll: postDetail.media.length > 2 ? 3 : postDetail.media.length,
    };

    const deletePost = async () => {
        try {
            let response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${postDetail.post_info.id}`, {
                withCredentials: true
            });
            
            if (response.data.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('게시글이 삭제되었습니다.');

                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/');
                }, 3000);
            }
        } catch (error) {
            console.log('Error: ', error.message);
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody(error.message);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }

    const createComment = async () => {
        const formData = new FormData();

        formData.append('post_id', postDetail.post_info.id);
        formData.append('content', comment);

        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // 파일 업로드 시 Content-Type 설정
                },
                withCredentials: true
            });

            console.log(response);
            if (response.data.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('댓글이 등록되었습니다.');

                setTimeout(() => {
                    setIsModalOpen(false);
                }, 3000);
            }
        } catch (error) {
            console.log('Error: ', error.message);
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody(error.message);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }

    // const deleteComment = async () => {
    //     try {
    //         let response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)
    //     } catch (error) {
            
    //     }
    // }

    return (
        <>
            <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
                <div className='flex justify-between border-b-2 border-black w-full'>
                    <p className='font-bold text-4xl mb-5'>{categoryMappings[postDetail.post_info.category].text}</p>
                    {isAuthor && 
                        <button className='
                            w-28 
                            h-12 
                            rounded-xl 
                            bg-red-400 
                            hover:bg-red-500 
                            text-white 
                            text-white 
                            transition 
                            duration-300'
                            onClick={deletePost}>
                            Delete
                        </button>
                    }
                </div>
                <div className='w-full flex justify-between border-b'>
                    <p className='mb-5 font-semibold text-xl'>{postDetail.post_info.title}</p>
                    <div className='flex gap-20 font-semibold text-xl'>
                        <p>
                            {postDetail.post_info.author.nickname.length >= 8 
                                ? postDetail.post_info.author.nickname.slice(0, 8) + '...' + postDetail.post_info.author.nickname.slice(-5) 
                                : postDetail.post_info.author.nickname}
                        </p>
                        <p>{postDetail.post_info.created_at.split('T')[0]} {postDetail.post_info.created_at.substring(11,19)}</p>
                    </div>
                </div>
                <div className='w-full max-h-full flex flex-col whitespace-pre-wrap'>
                    <div className='w-[60%] h-[60%]  mx-auto mb-10'>
                        <Slider {...settings} className='relative w-full h-full flex justify-center items-center'>
                            {postDetail.media.map((media, index) => (
                                <div key={index} className="w-full h-full">
                                    {media.type === 1 ? (
                                        <Image src={media.url} layout="fill" objectFit="contain" key={index}/>
                                    ) : (
                                        <video className='cursor-pointer' controls>
                                            <source src={media.url} />
                                        </video>
                                    )}
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div>
                        {postDetail.post_info.content}
                    </div>
                </div>
                <div className='w-full flex gap-3 justify-end my-16'>
                    {isAuthor && 
                        <Link 
                            href={`/posts/edit/${postDetail.post_info.id}`}
                            className='
                                w-[15%] 
                                border 
                                rounded-2xl 
                                p-3 
                                bg-blue-main 
                                text-white 
                                hover:bg-blue-dark 
                                transition 
                                duration-300
                                text-center'>
                            <button>
                                Edit
                            </button>
                        </Link>
                    }
                    <Link href='/' 
                        className='
                        w-[15%] 
                        border 
                        rounded-2xl 
                        p-3 
                        bg-blue-dark 
                        text-white 
                        hover:bg-blue-main 
                        transition 
                        duration-300
                        text-center'>
                        <button>
                            List
                        </button>
                    </Link>
                </div>
                <div className='w-full flex flex-col gap-4'>
                    <h2 className='text-xl font-semibold'>Comment</h2>
                    <textarea
                        className='border border-gray-300 rounded-lg p-2 w-full outline-none'
                        rows='4'
                        placeholder='댓글을 입력하세요.'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div className='flex justify-end'>
                        <button className='
                            py-2 
                            px-4 
                            bg-blue-500 
                            text-white 
                            text-lg
                            rounded-md 
                            hover:bg-blue-600 
                            transition 
                            duration-300
                            w-[6rem]' 
                            onClick={createComment}>
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default PostDetail;