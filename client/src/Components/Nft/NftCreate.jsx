import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
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
    const [fileType, setFileType] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [elements, setElements] = useState();

    const user = useSelector((state) => state.user);
    const router = useRouter();

    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = data => setElements({ ...data });

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

    const createAssets = async () => {
        console.log(fileUrl);
        console.log(uploadFile);
        console.log(elements);
    }

    useEffect(() => { if (elements !== undefined) createAssets(); }, [elements]);

    console.log(fileUrl);

    return (
        <>
            <div className='w-[50%] min-h-screen mx-auto mt-20 flex flex-col gap-20'>
                <div className='text-center'>
                    <p className='font-bold text-5xl'>NFT Create</p>
                </div>
                <div>
                    <form className='flex flex-col gap-12' onSubmit={handleSubmit(onSubmit)}>
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
                                {...register("ASSET_TITLE", { required: true, maxLength: 20 })} 
                                aria-invalid={errors.ASSET_TITLE ? "true" : "false"}
                                id="nft-title" 
                                type="text" 
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
                                {...register("ASSET_DESC", { required: true, maxLength: 20 })} 
                                aria-invalid={errors.ASSET_DESC ? "true" : "false"}
                                id="nft-description" 
                                type="text" 
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
                                type='submit'>
                                Mint
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    )
}

export default NftCreate;