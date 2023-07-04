import React from 'react';
import { Header, Footer } from "../Reference/index";

const DefaultLayout = ({ children }) => {
    return (
        <>
            <Header />
                <main className="relative mt-0"> {/* mt-20을 추가하여 Header와의 여백을 주고, relative를 추가하여 내부 요소의 위치를 조정할 수 있게 합니다. */}
                    {children}
                </main>
            <Footer />
        </>
    )
}

export default DefaultLayout;