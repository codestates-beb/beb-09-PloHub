import React, { useState } from 'react'
import DefaultLayout from '../Components/Layout/DefaultLayout'
import Nav from '../Components/Nav/Nav';
import { Toggle } from '../Components/Reference';


export default function Home() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <DefaultLayout>
            <Toggle isOn={isNavOpen} handleToggle={handleToggle} />
            <Nav isOpen={isNavOpen} />
        </DefaultLayout>
    )
}
