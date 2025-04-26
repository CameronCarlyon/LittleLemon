import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

import lemonLogo from '../assets/lemon.png';

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartItems } = useCart();

    const toggleMenu = () => {
        // Only toggle menu if window width is mobile breakpoint
        if (window.innerWidth <= 1266) {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    // Close menu if window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1266) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getTotalCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <header>
            <Link to='/home'><img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem'}}/></Link>
            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li><NavLink to='/menu' onClick={toggleMenu} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Menu</NavLink></li>
                    {isMenuOpen && <span></span>}
                    <li><NavLink to='/reservations' onClick={toggleMenu} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reservations</NavLink></li>
                    {isMenuOpen && <span></span>}
                    <li><NavLink to='/our-restaurant' onClick={toggleMenu} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Our Restaurant</NavLink></li>
                    {isMenuOpen && <span></span>}
                    <li><NavLink to='/contact-us' onClick={toggleMenu} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact Us</NavLink></li>
                    {isMenuOpen && <span></span>}
                    <li><NavLink to='/faqs' onClick={toggleMenu} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>FAQs</NavLink></li>
                    {isMenuOpen && <span></span>}
                    {isMenuOpen && <li><NavLink to='/cart' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Shopping Cart</NavLink></li>}
                </ul>
            </nav>
            <NavLink to='/cart' className="desktop-only">
                <FontAwesomeIcon className='icon' icon={faBasketShopping} />
                <div className='cart-count'>
                    {getTotalCartCount() || ''}
                </div>
            </NavLink>
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