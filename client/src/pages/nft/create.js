import React from 'react';
import cookie from 'cookie';
import { Header, Footer } from '../../Components/Reference';
import NftCreate from '../../Components/Nft/NftCreate';

const NftCreatePage = () => {

    return (
        <>
            <Header />
            <NftCreate />
            <Footer />
        </>
    )
}

export default NftCreatePage;

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