import React, { useEffect, useState } from 'react';
import { Header, Footer } from '../Components/Reference'

const signup = () => {
    const [password, setPassword] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [pwConfirmError, setPwConfirmError] = useState('');
    const [pwConfirmMessage, setPwConfirmMessage] = useState('');

    const passwordChange = (e) => {
        setPassword(e.target.value)
    };

    const passwordConfirmChange = (e) => {
        setPwConfirm(e.target.value);
    }
    
    const validatePassword = () => {
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (password.length < 8) {
            setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.');
        } else if (!passwordRegex.test(password)) {
            setPasswordError('비밀번호는 영문 대문자, 영문 소문자, 숫자, 특수기호를 모두 포함해야 합니다.');
        } else {
            setPasswordError('');
        }
    };

    const passwordConfirm = () => {
        if (pwConfirm.length === 0) {
        }
        if (password.length <= 0 && pwConfirm.length <= 0 ) {
            setPwConfirmError('');
            setPwConfirmMessage('');
        } else if (password === pwConfirm) {
            setPwConfirmMessage('비밀번호가 일치합니다.');
            setPwConfirmError('');
        } else if (password !== pwConfirm) {
            setPwConfirmError('비밀번호가 일치하지 않습니다.');
            setPwConfirmMessage('');
        }
    }

    useEffect(() => {
        validatePassword();
    }, [password]);

    useEffect(() => {
        passwordConfirm();
    }, [pwConfirm]);

    return (
        <>
            <Header />
            <div className='w-full mx-auto min-h-screen flex flex-col justify-center items-center bg-gray-200'>
            <div className='border border-gray-400 rounded-lg w-8/12 h-[1000px] flex flex-col items-center justify-center bg-white'>
                <div className='w-full h-full grid grid-rows-3 items-center justify-center'>
                    <div className='border-b-2 text-center text-5xl font-bold w-screen h-1/5 flex justify-center items-center'>
                        <p className='pb-36'>Sign Up</p>
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
                                    placeholder="example@gmail.com" />
                                <button className='border rounded-lg p-3 ml-3 bg-blue-main text-white hover:bg-blue-dark transition duration-300'> Confirm </button>
                            </div>
                        </div>
                        <div className='flex flex-col w-4/12'>
                            <label className='cursor-pointer text-xl text-left font-semibold mb-2'  htmlFor='password'>Password *</label>
                            <div className='flex flex-col'>
                                <input className='border rounded-xl px-2 py-3 w-full' 
                                    type="password" 
                                    name="password" 
                                    id='password'
                                    value={password} 
                                    onChange={passwordChange}
                                    required
                                    placeholder='비밀번호를 입력하세요' />
                                {password.length > 0 && <div className='text-left text-red-600'>{passwordError}</div>}
                            </div>
                        </div>
                        <div className='flex flex-col w-4/12'>
                            <label className='cursor-pointer text-xl text-left font-semibold mb-2'  htmlFor='password'>Password Confirm *</label>
                            <div className='flex flex-col'>
                                <input className='border rounded-xl px-2 py-3 w-full' 
                                    type="password" 
                                    name="password" 
                                    id='password' 
                                    value={pwConfirm}
                                    onChange={passwordConfirmChange}
                                    required
                                    placeholder='비밀번호를 입력하세요' />
                                <span className='text-left text-red-600'>{pwConfirmError}</span>
                                <span className='text-left text-blue-600'>{pwConfirmMessage}</span>
                            </div>
                        </div>
                    </div>
                    <button className='bg-blue-dark hover:bg-blue-main text-semibold text-white mx-auto px-4 py-2 mt-4 rounded-xl w-4/12 h-1/6'>
                        Sing Up
                    </button>
                </div>
            </div>
            </div>
            <Footer />
        </>
    );
};

export default signup;