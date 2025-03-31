import React from 'react';
import { Link } from 'react-router-dom';
import lemonLogo from '../assets/lemon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faSquareBluesky, faSquareInstagram } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
    return (
        <footer>
            <img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem'}} className='icon-white'/>
            <ul>
            <ul>
                <li><Link to='/menu'>Menu</Link></li>
                <li><Link to='/reservations'>Reservations</Link></li>
                <li><Link to='/our-restaurant'>Our Restaurant</Link></li>
                <li><Link to='/contact-us'>Contact Us</Link></li>
                <li><Link to='/faqs'>FAQs</Link></li>
            </ul>
            </ul>
            <div className='social'>
                <FontAwesomeIcon icon={faSquareFacebook} className='icon-social'/>
                <FontAwesomeIcon icon={faSquareBluesky} className='icon-social'/>
                <FontAwesomeIcon icon={faSquareInstagram} className='icon-social'/>
            </div>
            <h3 className='copyright'>Crafted by <a href="https://cameroncarlyon.com">Cameron Carlyon</a> | All rights reserved</h3>
        </footer>
    );
};


export default Footer;