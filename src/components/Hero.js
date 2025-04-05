import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className='hero'>
            <div>
                <h1>Little Lemon</h1>
                <h2 style={{ color: 'white' }}>Chicago</h2> 
            </div>
            <h3>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</h3>
            <Link to='/reservations'><div className='btn-primary'>Reserve a Table</div></Link>
        </div>
    );
};

export default Hero;