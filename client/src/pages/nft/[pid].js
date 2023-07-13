import React from 'react';
import cookie from 'cookie';
import axios from 'axios';
import { Header, Footer } from '../../Components/Reference';
import NftDetail from '../../Components/Nft/NftDetail';

const NftDetailPage = ({ nftInfo }) => {

    return (
        <>
            <Header />
            <NftDetail nftInfo={nftInfo} />
            <Footer />
        </>
    )
}

export default NftDetailPage;

/**
 * 서버 사이드 렌더링(SSR)을 위한 함수
 * 주어진 NFT ID(pid)에 해당하는 NFT의 상세 정보를 가져옴
 * 또한 사용자가 로그인 상태가 아니면 로그인 페이지로 리디렉션
 * 
 * @param {object} context - Next.js의 context 객체. 쿼리 파라미터, 쿠키 등 서버 사이드 렌더링에 필요한 정보를 담고 있음
 * @returns {object} - props 객체를 반환 'nftInfo' 키에는 NFT 상세 정보가 담겨 있음
 */
export const getServerSideProps = async (context) => {
    const { pid } = context.query;
    const cookies = cookie.parse(context.req.headers.cookie || '');
    let nftInfo;
    if (!cookies.access_token) {
        return {
            redirect: {
                destination: '/users/signin',
                permanent: false,
            },
        }
    }

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/nft/detail/${pid}`, {
            withCredentials: true
        });

        nftInfo = response.data.nft;
    } catch (error) {
        console.log('Error', error.message)
    }
    
    return {
        props: { nftInfo },
    }
}