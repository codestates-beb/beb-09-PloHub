import React from 'react';
import cookie from 'cookie';
import { Header, Footer } from '../../../Components/Reference';
import PostEdit from '../../../Components/Posts/PostEdit';

const PostEditPage = () => {

    return (
        <>
            <Header />
            <PostEdit />
            <Footer />
        </>
    )
}

export default PostEditPage;

/**
 * 서버 사이드 렌더링(SSR)을 위한 함수
 * 쿠키에서 'access_token'이 있는지 확인하고 없으면 사용자를 로그인 페이지로 리다이렉트
 * 
 * @param {object} context - Next.js의 context 객체. 쿼리 파라미터, 쿠키 등 서버 사이드 렌더링에 필요한 정보를 담고 있음
 * @returns {object} - redirect 객체 또는 props 객체를 반환, 'access_token'이 없는 경우, redirect 객체를 반환하여 
 * 사용자를 로그인 페이지로 리다이렉트, 토큰이 있는 경우, 빈 props 객체를 반환
 */
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
