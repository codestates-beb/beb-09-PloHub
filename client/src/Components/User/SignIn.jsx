import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { SET_EMAIL,
        SET_ADDRESS,
        SET_NICKNAME, 
        SET_LEVEL, 
        SET_TOKEN_BALANCE, 
        SET_DAILY_TOKEN_BALANCE,
        SET_ETH_BALANCE } from '../Redux/ActionTypes';
import { ModalLayout } from '../Reference';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const router = useRouter();
    const dispatch = useDispatch();

    const emailChange = (e) => {
        setEmail(e.target.value);
    }

    const passwordChange = (e) => {
        setPassword(e.target.value);
    }

    const signIn = async () => {
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        try {
            let response = await axios.post('http://localhost:4000/api/v1/users/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });
            console.log(response);
            if (response.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody('로그인 되었습니다.');

                const { email, nickname, level, address, eth_amount, token_amount, daily_token } = response.data.user_info;

                console.log('email: ' + email);
                console.log('address: ' + address);
                console.log('nickname: ' + nickname);
                console.log('level: ' + level);
                console.log('token: ' + token_amount);
                console.log('daily: ' + daily_token);
                console.log('eth_amount: ' + eth_amount);

                dispatch({ type: SET_EMAIL, payload: email });
                dispatch({ type: SET_ADDRESS, payload: address });
                dispatch({ type: SET_NICKNAME, payload: nickname });
                dispatch({ type: SET_LEVEL, payload: level });
                dispatch({ type: SET_TOKEN_BALANCE, payload: token_amount });
                dispatch({ type: SET_DAILY_TOKEN_BALANCE, payload: daily_token });
                dispatch({ type: SET_ETH_BALANCE, payload: eth_amount });
                

                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/users/mypage');
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setIsModalOpen(true);
            setModalTitle('Error');
            setModalBody(error.message);

            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000)
        }
    }

    return (
        <>
            <div className='w-full mx-auto min-h-screen flex flex-col justify-center items-center bg-gray-200'>
                <div className='border border-gray-400 rounded-lg w-8/12 h-[1000px] flex flex-col items-center justify-center bg-white'>
                    <div className='w-full h-full grid grid-rows-3 items-center justify-center'>
                        <div className='border-b-2 text-center text-5xl font-bold w-screen h-1/5 flex justify-center items-center'>
                            <p className='pb-36'>Sign In</p>
                        </div>
                        <div className='flex flex-col items-center gap-12 mt-4'>
                            <div className='flex flex-col w-4/12'>
                                <label className='cursor-pointer text-xl text-left font-semibold mb-2' htmlFor='email'>E-mail *</label>
                                <div className='flex flex'>
                                    <input className='border rounded-xl px-2 py-3 w-full' 
                                        type="email" 
                                        name="email" 
                                        id='email'
                                        required
                                        placeholder="example@gmail.com"
                                        onChange={emailChange} />
                                </div>
                            </div>
                            <div className='flex flex-col w-4/12'>
                                <label className='cursor-pointer text-xl text-left font-semibold mb-2'  htmlFor='password'>Password *</label>
                                <div className='flex flex-col'>
                                    <input className='border rounded-xl px-2 py-3 w-full' 
                                        type="password" 
                                        name="password" 
                                        id='password'
                                        required
                                        placeholder='비밀번호를 입력하세요'
                                        onChange={passwordChange} />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col items-center gap-12'>
                            <button className={`
                                ${email.length === 0 && password.length === 0 ? 'bg-gray-500' : 'bg-blue-dark hover:bg-blue-main'}
                                font-bold 
                                text-white 
                                mx-auto 
                                px-4 
                                py-4 
                                mt-4 
                                rounded-xl 
                                w-4/12 
                                h-1/6`}
                                onClick={signIn}
                                disabled={email.length === 0 && password.length === 0}>
                                Sing In
                            </button>
                            <Link href='/signup'>
                                <span className='hover:underline transition duration-300 font-bold'>Sign Up</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    );
};

export default SignIn;