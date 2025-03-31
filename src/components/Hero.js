import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className='hero'>
            <div>
                <h1>Little Lemon</h1>
                <h2>Chicago</h2> 
            </div>
            <h3>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</h3>
            <div className='button'><Link to='/reservations'>Reserve a Table</Link></div>
        </div>
    );
};

export default Hero;