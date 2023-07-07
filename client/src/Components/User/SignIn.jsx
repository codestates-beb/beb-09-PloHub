import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        } catch (error) {
            console.log(error);
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
                        <form className='flex flex-col items-center gap-12 mt-4' onSubmit={signIn}>
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
                        </form>
                        <div className='flex flex-col items-center gap-12'>
                            <button className='
                                bg-blue-dark 
                                hover:bg-blue-main 
                                font-bold 
                                text-white 
                                mx-auto 
                                px-4 
                                py-4 
                                mt-4 
                                rounded-xl 
                                w-4/12 
                                h-1/6'
                                type='submit'>
                                Sing In
                            </button>
                            <Link href='/signup'>
                                <span className='hover:underline transition duration-300 font-bold'>Sign Up</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;