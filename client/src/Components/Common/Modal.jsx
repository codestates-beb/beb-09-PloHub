import React, { useEffect } from 'react';
import Modal from 'react-modal';

const ModalLayout = ({ isOpen,  modalTitle, modalBody }) => {

    useEffect(() => {
        Modal.setAppElement('#__next');  // Next.js의 기본 root id는 #__next 입니다.
    }, []);

    return (
        <Modal
        isOpen={isOpen}
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
        <div className='h-full flex justify-center items-center w-[90%]'>
            {modalBody} 
        </div>
    </Modal>
    )
}

export default ModalLayout;