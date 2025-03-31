import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons'
import lemonLogo from '../assets/lemon.png';

const Header = () => {
    return (
        <header>
            <Link to='/home'><img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem'}}/></Link>
            
            <ul>
                <li><Link to='/menu'>Menu</Link></li>
                <li><Link to='/reservations'>Reservations</Link></li>
                <li><Link to='/our-restaurant'>Our Restaurant</Link></li>
                <li><Link to='/contact-us'>Contact Us</Link></li>
                <li><Link to='/faqs'>FAQs</Link></li>
            </ul>
            <FontAwesomeIcon icon={faBasketShopping} />
        </header>
    );
};

export default Header;