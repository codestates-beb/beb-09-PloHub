import React from 'react';
import axios from 'axios';
import cookie from 'cookie';
import { Header, Footer } from '../../Components/Reference'
import MyPage from '../../Components/User/MyPage';

const mypage = () => {

    return (
        <>
            <Header />
            <MyPage/>
            <Footer />
        </>
    )
}

export default mypage;

export const getServerSideProps = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    if (!cookies.access_token) {
        return {
            redirect: {
                destination: '/users/signin',
                permanent: false,
            },
        }
    }
    
    return {
        props: {},
    }
}
