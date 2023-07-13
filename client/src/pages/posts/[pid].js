import React from 'react';
import axios from 'axios';
import { Header, Footer } from '../../Components/Reference';
import PostDetail from '../../Components/Posts/PostDetail';

const PostDetailPage = ({ postDetail, commentList }) => {

    return (
        <>
            <Header />
            <PostDetail postDetail={postDetail} commentList={commentList} />
            <Footer />
        </>
    )
}

export default PostDetailPage;


export const getServerSideProps = async ({ query }) => {
    const { pid } = query;

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/detail/${pid}`, {
            withCredentials: true
        });
    
        const postDetail = res.data;

        const res2 = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/list/${postDetail.post_info.id}`, {
            withCredentials: true
        });

        const commentList = res2.data.comments;

        return {
            props: {
                postDetail,
                commentList
            }
        };
        } catch (error) {
        console.error('게시물을 가져오는데 실패했습니다:', error);
    
        return {
            props: {
                postList: null,
                commentList: null
            }
        };
    }
};