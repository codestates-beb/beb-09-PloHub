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

/**
 * 서버 사이드 렌더링(SSR)을 위한 함수
 * 주어진 게시물 ID(pid)에 해당하는 게시물의 상세 정보와, 해당 게시물에 달린 댓글들을 가져옴
 * 
 * @param {object} context - Next.js의 context 객체. 쿼리 파라미터, 쿠키 등 서버 사이드 렌더링에 필요한 정보를 담고 있음
 * @returns {object} - props 객체를 반환, 
 * 'postDetail' 키에는 게시물 상세 정보가, 'commentList' 키에는 해당 게시물에 달린 댓글들의 목록이 담겨 있음
 */
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