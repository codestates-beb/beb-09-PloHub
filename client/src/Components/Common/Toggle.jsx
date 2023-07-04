// Toggle.js
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from '../../styles/Toggle.module.css'

const Toggle = ({ isOn, handleToggle }) => {
    return (
        <div className={
            `w-12
            h-12
            flex 
            justify-center 
            items-center 
            relative
            top-8 
            left-12 
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
            <FiX className={styles.fix}  style={{ fontSize: '1.5rem', color: '#999' }} />
        ) : (
            <FiMenu className={styles.fix} style={{ fontSize: '1.5rem', color: '#999' }} />
        )}
        </div>
    );
};

export default Toggle;
