import React from 'react';
import axios from 'axios';
import { Header, Footer } from '../../Components/Reference'
import MyPage from '../../Components/User/MyPage';

const mypage = ({ userInfo }) => {

    return (
        <>
            <Header />
            <MyPage userInfo={userInfo} />
            <Footer />
        </>
    )
}

export default mypage;

export const getServerSideProps = async (context) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/mypage`, {
            withCredentials: true
        });

        console.log('token, res', token, res);
        const userInfo = res.data;

        return {
            props: {
                userInfo
            }
        };
    } catch (error) {
        console.error('Failed to fetch user info:', error);

        return {
            props: {
                userInfo: null
            }
        };
    }
}