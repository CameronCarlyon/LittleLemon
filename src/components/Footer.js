import React from 'react';
import { Link } from 'react-router-dom';
import lemonLogo from '../assets/lemon.png';
import HyperlinkLabel from './HyperlinkLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faSquareBluesky, faSquareInstagram } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
    // Navigation items array
    const navigationItems = [
        { href: '/menu', text: 'Menu' },
        { href: '/reservations', text: 'Reservations' },
        { href: '/our-restaurant', text: 'Our Restaurant' },
        { href: '/contact-us', text: 'Contact Us' },
        { href: '/faqs', text: 'FAQs' }
    ];

    const [isMobileView, setIsMobileView] = React.useState(window.innerWidth < 1248);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1248);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <footer>
            <Link to='/home'>
                <img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem' }} className='icon-white' />
            </Link>
            <ul>
                {navigationItems.map((item) => (
                    <li key={item.href}>
                        <HyperlinkLabel href={item.href} text={item.text} />
                    </li>
                ))}
            </ul>
            <div className='social'>
                <FontAwesomeIcon icon={faSquareFacebook} className='icon-social' />
                <FontAwesomeIcon icon={faSquareBluesky} className='icon-social' />
                <FontAwesomeIcon icon={faSquareInstagram} className='icon-social' />
            </div>
            <h3 className='copyright'>
                Crafted by <HyperlinkLabel href="https://cameroncarlyon.com" text="Cameron Carlyon" />
                {isMobileView ? <br /> : ' | '}
                All rights reserved
            </h3>
        </footer>
    );
};


export default Footer;