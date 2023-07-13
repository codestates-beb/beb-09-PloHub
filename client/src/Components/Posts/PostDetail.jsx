import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { AiOutlineDelete } from 'react-icons/ai'
import { ModalLayout } from '../Reference';

const PostDetail = ({ postDetail, commentList }) => {
    const user = useSelector((state) => state.user);
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    // 카테고리 아이콘 매핑
    const categoryMappings = {
        0: { text: 'All' },
        1: { text: '행사 정보' },
        2: { text: '코스 정보' },
        3: { text: '참여 후기' },
    };

    const isPostAuthor = user && user.email === postDetail.post_info.author.email;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: postDetail.media.length > 2 ? 3 : postDetail.media.length,
        slidesToScroll: postDetail.media.length > 2 ? 3 : postDetail.media.length,
    };

    /**
     * 클립보드에 작성자의 지갑 주소를 복사하는 함수
     * 복사가 성공하면 성공 메시지를, 실패하면 에러 메시지를 모달로 표시
     */
    const copyAddr = async () => {
        try {
            await navigator.clipboard.writeText(postDetail.post_info.author.address);
            setIsModalOpen(true);
            setModalTitle('Success');
            setModalBody('지갑주소가 복사되었습니다.');

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        } catch (err) {
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody('지갑주소 복사가 실패되었습니다.');

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }

    /**
     * 게시글을 삭제하는 함수입니다. 삭제 성공 시 성공 메시지를, 
     * 실패 시 에러 메시지를 모달로 표시
     */
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

    /**
     * 새로운 댓글을 생성하는 함수
     * 게시글 ID와 댓글 내용을 서버에 POST 요청으로 보냄
     * 댓글 생성 성공 시 성공 메시지를, 실패 시 에러 메시지를 모달로 표시
     */
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

            if (response.data.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('댓글이 등록되었습니다.');
                
                setTimeout(() => {
                    setIsModalOpen(false);
                    setComment('');
                    router.reload();
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

    /**
     * 댓글을 삭제하는 함수입니다. 삭제 성공 시 성공 메시지를, 실패 시 에러 메시지를 모달로 표시
     * @param {string} id - 삭제할 댓글의 ID
     */
    const deleteComment = async (id) => {
        try {
            let response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${id}`, {
                withCredentials: true
            });

            if (response.data.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('댓글이 삭제되었습니다.');

                const updatedComments = comments.filter(comment => comment.id !== commentId);
                setComments(updatedComments);
                
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.reload();
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

    return (
        <>
            <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
                <div className='flex justify-between border-b-2 border-black w-full'>
                    <p className='font-bold text-4xl mb-5'>{categoryMappings[postDetail.post_info.category].text}</p>
                    {isPostAuthor && 
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
                        <p onClick={copyAddr} className='cursor-pointer hover:underline' title="Click to copy the address">
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
                <div className='w-full flex flex-col gap-4'>
                    <h2 className='text-xl font-semibold'>Comment</h2>
                    {commentList.slice().reverse().map((comment) => {
                        return (
                            <div className='w-full grid grid-cols-2 items-center border rounded-xl p-3' key={comment.id}>
                                <div>
                                    <p className='text-lg font-semibold'>{comment.content}</p>
                                </div>
                                <div className='text-right flex justify-end gap-6'>
                                    <div>
                                        <p className='font-bold text-lg'>{comment.author.nickname}</p>
                                        <div>
                                            <p className='text-sm'>{comment.created_at.split('T')[0]} {comment.created_at.substring(11,19)}</p>
                                        </div>
                                    </div>
                                    {user.email === comment.author.email &&
                                        <div className='flex justify-end items-center' onClick={() => deleteComment(comment.id)}>
                                            <AiOutlineDelete className="text-red-500 cursor-pointer" size={26} />
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
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
                <div className='w-full flex gap-3 justify-end my-16'>
                    {isPostAuthor && 
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
                
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default PostDetail;