import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const SignIn = () => {
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
                                        placeholder="example@gmail.com" />
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
                                        placeholder='비밀번호를 입력하세요' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col items-center gap-12'>
                            <button className='bg-blue-dark hover:bg-blue-main font-bold text-white mx-auto px-4 py-4 mt-4 rounded-xl w-4/12 h-1/6'>
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