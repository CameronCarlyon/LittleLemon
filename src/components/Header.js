import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

import lemonLogo from '../assets/lemon.png';

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <Link to='/home'><img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem'}}/></Link>
            <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><Link to='/menu' onClick={toggleMenu}>Menu</Link></li>
                    {isMenuOpen && <span></span>}
                    <li><Link to='/reservations' onClick={toggleMenu}>Reservations</Link></li>
                    {isMenuOpen && <span></span>}
                    <li><Link to='/our-restaurant' onClick={toggleMenu}>Our Restaurant</Link></li>
                    {isMenuOpen && <span></span>}
                    <li><Link to='/contact-us' onClick={toggleMenu}>Contact Us</Link></li>
                    {isMenuOpen && <span></span>}
                    <li><Link to='/faqs' onClick={toggleMenu}>FAQs</Link></li>
                    {isMenuOpen && <span></span>}
                    {isMenuOpen && <li><Link to='/shopping-basket'>Shopping Cart</Link></li>}
                </ul>
            </nav>
            <Link to='/shopping-cart'><FontAwesomeIcon className='icon desktop-only' icon={faBasketShopping} /></Link>
            <div 
                className="burger-menu mobile-only" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
            >
                <FontAwesomeIcon 
                    className='icon' 
                    icon={isMenuOpen ? faTimes : faBars} 
                />
            </div>
        </header>
    );
};

export default Header;