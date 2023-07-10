import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css';
import { ModalLayout } from '../Reference';

const PostCreate = () => {
    const router = useRouter();
    const user = useSelector((state) => state.user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [selectCategory, setSelectCategory] = useState('');

    useEffect(() => {
        if (!user.email) {
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody('로그인이 필요합니다.');

            setTimeout(() => {
                setIsModalOpen(false);
                router.push('/users/signin');
            }, 3000);
        }
    }, [user]);

    const categoryChange = (e) => {
        setSelectCategory(e.target.value);
    }

    const userLevelCheck = () => {
        if(user.level !== '2' && selectCategory === 'courseinfo') {
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

    const QuillWrapper = dynamic(() => import('react-quill'), {
        ssr: false,
        loading: () => <p>Loading ...</p>,
    });

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    }
    /*
    * Quill editor formats
    * See https://quilljs.com/docs/formats/
    */
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ]

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
                        <option className="text-sm" value="all">All</option>
                        <option className="text-sm" value="eventinfo">행사 정보</option>
                        <option className="text-sm" value="courseinfo">코스 정보</option>
                        <option className="text-sm" value="review">참여 후기</option>
                    </select>
                </div>
                <div className='w-2/5'>
                    <input className='w-full border-b focus:border-black transition duration-300 py-2 px-3' type="text" name="" placeholder='제목을 입력해 주세요'/>
                </div>
                <div className='w-full h-[45rem]'>
                    <QuillWrapper modules={modules} formats={formats} theme="snow" placeholder={'내용을 입력해주세요.'} style={{ height: '100%'}}/>
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
                        duration-300'>
                        Create
                    </button>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    );
};

export default PostCreate;