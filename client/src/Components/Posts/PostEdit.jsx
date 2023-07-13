import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ModalLayout } from '../Reference';

const PostCreate = () => {
    const router = useRouter();
    const user = useSelector((state) => state.user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [selectCategory, setSelectCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent ] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);

    const categoryChange = (e) => {
        setSelectCategory(e.target.value);
    }

    const userLevelCheck = () => {
        if(user.level !== 2 && selectCategory === 'courseinfo') {
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody('해당 카테고리는 2레벨만 작성 가능합니다.');

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }

    useEffect(() => {
        userLevelCheck()
    }, [selectCategory]);

    const fileInputRef = useRef(null);

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)

        files.forEach((file) => {
            const extension = file.name.split('.').pop().toLowerCase();
        
            if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                setImages((prevImages) => [...prevImages, file]);
            } else if (extension === 'mp4' || extension === 'avi' || extension === 'mov') {
                setVideos((prevVideos) => [...prevVideos, file]);
            }
        });
        setSelectedFile(files)
    };

    const createPost = async () => {

        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);
        if (selectCategory === 'all') {
            formData.append('category', 0);
        } else if(selectCategory === 'eventinfo') {
            formData.append('category', 1);
        } else if (selectCategory === 'courseinfo') {
            formData.append('category', 2);
        } else if (selectCategory === 'review') {
            formData.append('category', 3);
        }

        images.forEach((image) => {
            formData.append('images', image);
        });

        videos.forEach((video) => {
            formData.append('videos', video);
        });
        
        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // 파일 업로드 시 Content-Type 설정
                },
                withCredentials: true
            });

            if (response.data.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('게시글이 등록되었습니다.');

                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/users/mypage');
                }, 3000);
            }
        } catch (e) {
            console.log('Error: ', e.message);
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody(e.message);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }
    

    return (
        <>
            <div className='w-[90%] min-h-screen mx-auto mt-20 flex flex-col gap-12'>
                <div>
                    <p className='font-bold text-4xl'>게시글 작성</p>
                </div>
                <div className='w-1/5'>
                    <select className="
                        border-b 
                        outline-none 
                        focus:border-black 
                        transition 
                        duration-300 
                        py-2 
                        px-4 
                        w-full" 
                        value={selectCategory}
                        onChange={categoryChange}
                        required>
                        <option className="text-sm" value="" disabled>카테고리를 선택해 주세요.</option>
                        <option className="text-sm" value="eventinfo">행사 정보</option>
                        <option className="text-sm" value="courseinfo">코스 정보</option>
                        <option className="text-sm" value="review">참여 후기</option>
                    </select>
                </div>
                <div className='w-2/5'>
                    <input 
                        className='w-full border-b focus:border-black transition duration-300 py-2 px-3' 
                        type="text" 
                        name="" 
                        placeholder='제목을 입력해 주세요'
                        onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className='w-full h-[45rem]'>
                    <input
                        type='file'
                        ref={fileInputRef}
                        className='w-full hidden'
                        onChange={handleFileChange}
                        multiple
                    />
                    <div className='flex w-[30%] justify-between mb-5'>
                        <p className='border-b w-[80%] m-0'>
                            {selectedFile.length > 0 ? (
                                selectedFile.map((file) => file.name + ', ')
                            ) : (
                                '파일을 선택해 주세요.'
                            )
                            }
                        </p>
                        <button 
                        className='border rounded-lg p-2 bg-blue-main text-white hover:bg-blue-dark transition duration-300'
                        onClick={handleFileSelect}>
                            파일 선택
                        </button>
                    </div>
                    <textarea className="border border-gray-300 rounded-lg w-full h-full p-3 outline-none" onChange={(e) => setContent(e.target.value)} />
                </div>
                <div className='w-full flex gap-3 justify-end mt-16'>
                    <button className='
                        w-[15%] 
                        border 
                        rounded-2xl 
                        p-3 
                        bg-blue-main 
                        text-white 
                        hover:bg-blue-dark 
                        transition 
                        duration-300'
                        onClick={() => router.push('/')}>
                        Cancel
                    </button>
                    <button className='
                        w-[15%] 
                        border 
                        rounded-2xl 
                        p-3 
                        bg-blue-dark 
                        text-white 
                        hover:bg-blue-main 
                        transition 
                        duration-300'
                        onClick={createPost}>
                        Create
                    </button>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    );
};

export default PostCreate;