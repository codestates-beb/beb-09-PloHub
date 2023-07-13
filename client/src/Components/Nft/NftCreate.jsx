import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BsFillImageFill } from 'react-icons/bs';
import { ModalLayout } from '../../Components/Reference';

const EXTENSIONS = [
    { type: 'gif' },
    { type: 'jpg' },
    { type: 'jpeg' },
    { type: 'png' },
    { type: 'mp4' },
];

const NftCreate = () => {
    const router = useRouter()
    const [fileType, setFileType] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    /**
     * 파일 업로드 이벤트를 처리
     * @param {Event} e - 파일 업로드 이벤트
     * @returns {void}
     */
    const fileUpload = (e) => {

        const FILE = e.target.files[0];
        const SIZE = 10;
        const TYPE = (FILE.type).split('/')[1];
        const FSIZE = (FILE.size) / Math.pow(10, 6);

        if (FSIZE < SIZE) {
            EXTENSIONS.forEach(e => {
                if (e.type === TYPE) {
                    const objectURL = URL.createObjectURL(FILE);
                    setFileUrl(objectURL);
                    setFileType(TYPE);
                    setUploadFile(FILE);
                }
            });
        } else {
            setIsModalOpen(true);
            setModalTitle("Error");
            setModalBody(`파일 사이즈가 MAX SIZE ${SIZE}보다 큽니다.`);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
    }

    const minting = async () => {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', desc);
        formData.append('image', uploadFile);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/nft/mint`, formData, {
                withCredentials: true,
            });

            console.log(response);
            if (response.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('민팅되었습니다.');
    
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/users/mypage');
                }, 3000);
            }
            if (response.status === 200) {

            }
        } catch (error) {
            console.log(error)
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
            <div className='w-[50%] min-h-screen mx-auto mt-20 flex flex-col gap-20'>
                <div className='text-center'>
                    <p className='font-bold text-5xl'>NFT Create</p>
                </div>
                <div>
                    <div className='flex flex-col gap-12'>
                        <div className="w-full h-[30rem] border-2 border-dashed rounded-xl">
                            <label className="
                                h-full 
                                text-gray-400 
                                flex 
                                items-center 
                                justify-center 
                                cursor-pointer
                                hover:bg-gray-300
                                transition
                                duration-300" 
                                htmlFor="nft-file">
                                {fileUrl ? (
                                    <div className="w-full h-full">
                                        {fileType === 'mp4' ? (
                                            <video controls src={fileUrl} className="w-full h-full object-contain" />
                                        ) : (
                                            <img src={fileUrl} className="w-full h-full object-contain" alt="NFT" />
                                        )}
                                    </div>
                                ) : (
                                    <BsFillImageFill size={80} />
                                )}
                                <input 
                                    className="hidden" 
                                    id="nft-file" 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    onChange={fileUpload} 
                                    required />
                            </label>
                        </div>
                        <div>
                            <label className="block text-black text-xl font-bold mb-2" htmlFor="nft-title">
                                NFT Title *
                            </label>
                            <input className="
                                shadow 
                                border 
                                rounded-md 
                                w-[50%] 
                                py-2 
                                px-3 
                                focus:outline-none" 
                                id="nft-title" 
                                type="text" 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="NFT Title" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-black text-xl font-bold mb-2" htmlFor="nft-description">
                                NFT Description
                            </label>
                            <textarea className="
                                shadow 
                                border 
                                rounded-md 
                                w-full 
                                py-2 
                                px-3 
                                focus:outline-none 
                                h-[20rem]" 
                                id="nft-description" 
                                type="text" 
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="NFT Description" />
                        </div>
                        <div className="mb-4 w-full">
                            <button className="
                                bg-blue-dark 
                                hover:bg-blue-main 
                                text-white 
                                text-lg 
                                font-bold 
                                py-2 
                                px-4 
                                rounded-lg 
                                transition 
                                duration-300 
                                w-full 
                                h-[3rem]" 
                                onClick={minting}>
                                Mint
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default NftCreate;