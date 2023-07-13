import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ModalLayout } from '../Reference';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [pwConfirmError, setPwConfirmError] = useState('');
    const [pwConfirmMessage, setPwConfirmMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [signUpDisabled, setSignUpDisabled] = useState(true);
    const [emailValidated, setEmailValidated] = useState(false);

    const router = useRouter();

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
    
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/check-email`,
                    { email }, // 요청 데이터를 JSON 객체로 전달
                    {
                    headers: {
                        "Content-Type": "application/json", // Content-Type을 application/json으로 설정
                        "Accept": "application/json",
                    },
                    }
                );
                if (response.data.status === 200) {
                    setEmailValidated(true);
                    setIsModalOpen(true);
                    setModalTitle('Success');
                    setModalBody('이 이메일은 사용 가능합니다.');

                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 3000);
                } else {
                    setEmailValidated(false);
                    setIsModalOpen(true);
                    setModalTitle('Error');
                    setModalBody('오류가 발생했습니다.');

                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 3000);
                }
            } catch (error) {
                console.log('Error', error.message);
                if (error.response && error.response.status === 400) {
                    setEmailValidated(false);
                    setIsModalOpen(true);
                    setModalTitle('Error');
                    setModalBody(error.message);
                    document.getElementById('confirm-email').style.display = 'block';
    
                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 3000);
                } else {
                    alert("서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                }
            }
        }
    
        /**
         * 비밀번호 유효성 검사를 수행하는 함수
         * - 비밀번호는 최소 8자 이상이어야 하며,
         * - 대문자, 소문자, 숫자, 특수기호가 모두 포함되어야 함
         */
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

    /**
     * 비밀번호 확인 유효성 검사를 수행하는 함수
     * - 비밀번호 확인 입력값이 비어있지 않아야 하며,
     * - 비밀번호 입력값과 비밀번호 확인 입력값이 동일해야 함
     */
    const passwordConfirm = () => {
        if (pwConfirm.length === 0) {
        }
        if (password.length <= 0 && pwConfirm.length <= 0 ) {
            setPwConfirmError('');
            setPwConfirmMessage('');
        } else if (password === pwConfirm) {
            setPwConfirmMessage('비밀번호가 일치합니다.');
            setSignUpDisabled(false);
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

    /**
     * 회원 가입을 처리하는 함수.
     *
     * @async
     * @function signUp
     * @returns {Promise<void>} Promise 객체
     * @throws {Error} 회원 가입 중 발생한 오류
     */
    const signUp = async () => {
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        try {
            let response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
            });
            if (response.status === 200) {
                setIsModalOpen(true);
                setModalTitle('Success');
                setModalBody(response.data.message);

                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/users/signin');
                }, 3000);
            }
        } catch (error) {
            console.log('Error', error.message);
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
                            <p className='pb-36'>Sign Up</p>
                        </div>
                        <div className='flex flex-col items-center gap-12 mt-4'>
                            <div className='flex flex-col w-4/12'>
                                <label className='cursor-pointer text-xl text-left font-semibold mb-2 w-[20%]' htmlFor='email'>E-mail *</label>
                                <div className='flex flex-col'>
                                    <div className='flex'>
                                        <input className='border rounded-xl px-2 py-3 w-full' 
                                            type="email" 
                                            name="email" 
                                            id='email'
                                            required
                                            placeholder="example@gmail.com"
                                            onChange={(e) => setEmail(e.target.value)} />
                                        <button className={`
                                            ${email.length === 0 ? 'bg-gray-500' : 'bg-blue-main hover:bg-blue-dark '}
                                            border 
                                            rounded-lg 
                                            p-3 
                                            ml-3 
                                            text-white 
                                            transition 
                                            duration-300`}
                                            onClick={emailConfirm}
                                            disabled={email.length === 0}>
                                            Confirm 
                                        </button>
                                    </div>
                                    <div className='text-left text-red-600 hidden' id='confirm-email'>중복된 이메일입니다.</div>
                                </div>
                            </div>
                            <div className='flex flex-col w-4/12'>
                                <label className='cursor-pointer text-xl text-left font-semibold mb-2 w-[25%]'  htmlFor='password'>Password *</label>
                                <div className='flex flex-col'>
                                    <input className='border rounded-xl px-2 py-3 w-full' 
                                        type="password" 
                                        name="password" 
                                        id='password'
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder='비밀번호를 입력하세요' />
                                    {password.length > 0 && <div className='text-left text-red-600'>{passwordError}</div>}
                                </div>
                            </div>
                            <div className='flex flex-col w-4/12'>
                                <label className='cursor-pointer text-xl text-left font-semibold mb-2 w-[40%]'  htmlFor='password'>Password Confirm *</label>
                                <div className='flex flex-col'>
                                    <input className='border rounded-xl px-2 py-3 w-full' 
                                        type="password" 
                                        name="password" 
                                        id='password' 
                                        value={pwConfirm}
                                        onChange={(e) => setPwConfirm(e.target.value)} 
                                        required
                                        placeholder='비밀번호를 입력하세요' />
                                    <span className='text-left text-red-600'>{pwConfirmError}</span>
                                    <span className='text-left text-blue-600'>{pwConfirmMessage}</span>
                                </div>
                            </div>
                        <button className={`
                            ${signUpDisabled || !emailValidated ? 'bg-gray-500' : 'bg-blue-dark hover:bg-blue-main'}
                            text-semibold 
                            text-white 
                            mx-auto 
                            px-4 
                            py-2 
                            mt-4 
                            rounded-xl 
                            w-4/12 
                            h-1/6
                            transition
                            duration-300`}
                            onClick={signUp}
                            disabled={signUpDisabled || !emailValidated}>
                            Sing Up
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalLayout isOpen={isModalOpen} modalTitle={modalTitle} modalBody={modalBody} />
        </>
    );
};

export default SignUp;