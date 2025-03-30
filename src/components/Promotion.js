import React from 'react';
import promoImage from '../assets/bruchetta.svg';

const Promotion = () => {
    return (
        <div>
            <img src={promoImage} alt='Bruchetta' className='promo'/>
        </div>
    );
};

export default Promotion;