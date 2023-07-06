import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Modal from 'react-modal';
import { BsFillImageFill } from 'react-icons/bs';
import { Header, Footer } from '../../Components/Reference';

const EXTENSIONS = [
    { type: 'gif' },
    { type: 'jpg' },
    { type: 'jpeg' },
    { type: 'png' },
    { type: 'mp4' },
];

const create = () => {
    const [fileType, setFileType] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [elements, setElements] = useState();

    useEffect(() => {
        Modal.setAppElement('#__next');  // Next.js의 기본 root id는 #__next 입니다.
    }, []);

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
            setModalIsOpen(true);
            setModalTitle("Error");
            setModalBody(`파일 사이즈가 MAX SIZE ${SIZE}보다 큽니다.`);

            setTimeout(() => {
                setModalIsOpen(false);
            }, 3000);
        }
    }

    const createAssets = async () => {
        console.log(fileUrl);
        console.log(uploadFile);
        console.log(elements);
    }

    useEffect(() => { if (elements !== undefined) createAssets(); }, [elements]);

    return (
        <>
            <Header />
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
            <Modal
                isOpen={modalIsOpen}
                className='w-[30%]'
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',   // vertical center
                        justifyContent: 'center', // horizontal center
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        right: 'auto',
                        bottom: 'auto',
                        width: '30%',
                        height: '25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'black',
                        backgroundColor: 'white',
                        outline: 'none',
                        borderRadius: '3rem',
                    }
                }}
                contentLabel="File Size Warning"
            >
                <h2 className='font-bold text-3xl border-b border-black w-[90%] text-center p-5'>
                    {modalTitle}
                </h2>
                <p className='h-full flex justify-center items-center'>
                    {modalBody} 
                </p>
            </Modal>
            <Footer />
        </>
    )
}

export default create;