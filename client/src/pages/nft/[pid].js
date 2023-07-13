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