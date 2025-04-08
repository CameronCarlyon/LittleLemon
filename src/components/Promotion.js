import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const Promotion = () => {
    return (
        <div className="promotion-banner">
            <FontAwesomeIcon 
                icon={faXmark} 
                style={{ display: 'flex' }} 
                className='close-btn' 
                onClick={() => document.querySelector('.promotion-banner').style.display = 'none'} 
            />
            <h3>Subscribe to Our Newsletter!</h3>
            <input required
                type="email" 
                placeholder="Enter your email address" 
            />
        </div>
    );
};

export default Promotion;