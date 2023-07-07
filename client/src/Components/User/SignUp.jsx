import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [pwConfirmError, setPwConfirmError] = useState('');
    const [pwConfirmMessage, setPwConfirmMessage] = useState('');

    /**
     * 이메일 확인을 위한 함수
     *
     * @async
     * @function emailConfirm
     * @returns {Promise<void>} Promise 객체
     * @throws {Error} 이메일 확인 중 발생한 오류
     */
    const emailConfirm = async () => {
        const formData = new FormData();

        formData.append('email', email);
        console.log(email);

        try {
            const response = await axios.post(
                // `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/check-email`,
                `http://localhost:4000/api/v1/users/check-email`,
                { email }, // 요청 데이터를 JSON 객체로 전달
                {
                headers: {
                    "Content-Type": "application/json", // Content-Type을 application/json으로 설정
                    "Accept": "application/json",
                },
                }
            );
            console.log(response);
            if (response.data.status === 200) {
                alert(response.data.message);
            } else {
                alert("오류가 발생했습니다.");
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 400) {
                alert("이 이메일은 이미 사용 중입니다.");
            } else {
                alert("서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        }
    }

    const emailChange = (e) => {
        setEmail(e.target.value);
    }

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

    const signUp = async () => {
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        try {
            let response = await axios.post(`http://localhost:4000/api/v1/users/signup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
            });
            console.log(response)
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
                            <p className='pb-36'>Sign Up</p>
                        </div>
                        <form className='flex flex-col items-center gap-12 mt-4' onSubmit={signUp}>
                            <div className='flex flex-col w-4/12'>
                                <label className='cursor-pointer text-xl text-left font-semibold mb-2' htmlFor='email'>E-mail *</label>
                                <div className='flex flex-col'>
                                    <div className='flex'>
                                        <input className='border rounded-xl px-2 py-3 w-full' 
                                            type="email" 
                                            name="email" 
                                            id='email'
                                            required
                                            placeholder="example@gmail.com"
                                            onChange={emailChange} />
                                        <button className='
                                            border 
                                            rounded-lg 
                                            p-3 
                                            ml-3 
                                            bg-blue-main 
                                            text-white 
                                            hover:bg-blue-dark 
                                            transition 
                                            duration-300'
                                            onClick={emailConfirm}>
                                            Confirm 
                                        </button>
                                    </div>
                                    <div className='text-left text-red-600'>중복된 이메일입니다.</div>
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
                        </form>
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
                            h-1/6'
                            type='submit'>
                            Sing Up
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;