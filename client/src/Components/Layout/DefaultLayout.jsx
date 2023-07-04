import React from 'react';
import { Header, Footer } from "../Reference/index";

const DefaultLayout = ({ children }) => {
    return (
        <div className='max-h-screen'>
            <Header />
                {children}
            <Footer />
        </div>
    )
}

export default DefaultLayout;