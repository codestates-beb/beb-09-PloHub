import React from 'react';
import { Header, Footer } from '../Components/Reference'

const signup = () => {
    return (
        <>
            <Header />
            <div className='w-full mx-auto min-h-screen flex flex-col justify-center items-center bg-gray-200'>
                <div className='border border-gray-400 rounded-lg w-8/12 h-[1000px] flex flex-col items-center justify-center bg-white'>
                    <div className='w-full h-full grid grid-rows-3 items-center justify-center'>
                        <div className='border-b-2 text-center text-5xl font-bold w-screen h-1/5 flex justify-center items-center'>
                            <p className='pb-36'>Sign Up</p>
                        </div>
                        <div className='grid justify-center items-center gap-12 mt-4'>
                            <div className='grid grid-cols-2 justify-center'>
                                <label className='cursor-pointer text-xl text-center font-semibold' for='email'>E-mail:</label>
                                <input className='border rounded-xl px-2 mr-20 py-3 w-full' type="text" name="email" id='email' value="" placeholder='이메일을 입력하세요' />
                            </div>
                            <div className='grid grid-cols-2 justify-center'>
                                <label className='cursor-pointer text-xl text-center font-semibold' for='password'>Password:</label>
                                <input className='
                                    border 
                                    rounded-xl 
                                    px-2 
                                    mr-20 
                                    py-3 
                                    w-full' 
                                    type="password" 
                                    name="password" 
                                    id='password' 
                                    value="" 
                                    placeholder='비밀번호를 입력하세요' />
                            </div>
                        </div>
                        <button className='
                            bg-blue-dark 
                            hover:bg-blue-main 
                            text-semibold 
                            text-white 
                            mx-auto 
                            px-4 
                            py-2 
                            mt-4 
                            rounded-xl 
                            w-4/12 
                            h-1/6'>
                            Sing Up
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default signup;