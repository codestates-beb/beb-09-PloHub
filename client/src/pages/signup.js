import React from 'react';
import { Header, Footer } from '../Components/Reference'

const signup = () => {
    return (
        <>
            <Header />
                <div className='w-8/12 mx-auto min-h-screen'>
                    <div className='border rounded-lg w-full flex justify-center h-full'>
                        <h2>회원가입</h2>
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default signup;