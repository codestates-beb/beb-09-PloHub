import React from 'react';
import axios from 'axios';
import cookie from 'cookie';
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
    const cookies = cookie.parse(context.req.headers.cookie || '');
    console.log(cookies['access_token']);
    const token = cookies['access_token'];
    try {
        const res = await axios.get('http://localhost:4000/api/v1/users/mypage', {
            headers: {
                Authorization: `Bearer ${token}`
            },
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