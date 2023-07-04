import React from 'react';
import { Header, Footer } from "../Reference/index";

const DefaultLayout = ({ children }) => {
    return (
        <>
            <Header />
                {children}
            <Footer />
        </>
    )
}

export default DefaultLayout;