import React from 'react';
import axios from 'axios';
import { Header, Footer } from '../../Components/Reference';
import PostDetail from '../../Components/Posts/PostDetail';

const PostDetailPage = ({ postDetail }) => {

    return (
        <>
            <Header />
            <PostDetail postDetail={postDetail} />
            <Footer />
        </>
    )
}

export default PostDetailPage;


export const getServerSideProps = async ({ query }) => {
    const { pid } = query;

    console.log('pid', pid);

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/detail/${pid}`, {
            withCredentials: true
        });
    
        const postDetail = res.data;

        console.log(res.data);
    
        return {
            props: {
                postDetail,
            }
        };
        } catch (error) {
        console.error('게시물을 가져오는데 실패했습니다:', error);
    
        return {
            props: {
                postList: null,
            }
        };
    }
};