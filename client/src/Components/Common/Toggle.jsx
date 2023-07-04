// Toggle.js
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Toggle = ({ isOn, handleToggle }) => {
    return (
        <div className={
            `absolute
            top-8 
            left-12 
            border-2
            p-2
            rounded
            border-solid
            border-black
            transition-all 
            duration-500 
            ease-in-out 
            transform ${isOn ? 'translate-x-64' : 'translate-x-0'} ...`
        } onClick={handleToggle}>
        {isOn ? (
            <FiX style={{ fontSize: '2rem' }} />
        ) : (
            <FiMenu style={{ fontSize: '2rem' }} />
        )}
        </div>
    );
};

export default Toggle;
