// Toggle.js
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Toggle = ({ isOn, handleToggle }) => {
    return (
        <div className={
            `absolute
            top-8 
            left-8 
            border
            p-2
            rounded
            border-solid
            border-gray
            transition-all 
            duration-500 
            ease-in-out 
            transform ${isOn ? 'translate-x-64' : 'translate-x-0'} ...`
        } onClick={handleToggle}>
        {isOn ? (
            <FiX style={{ fontSize: '1.5rem', color: '#999' }} />
        ) : (
            <FiMenu style={{ fontSize: '1.5rem', color: '#999' }} />
        )}
        </div>
    );
};

export default Toggle;
