import React from 'react';
import LittleLemonLogo from '../components/LittleLemonLogo';
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

    // Social media links data
    const socialLinks = [
        { icon: faSquareFacebook, href: './facebook', label: 'Facebook' },
        { icon: faSquareBluesky, href: './bluesky', label: 'Bluesky' },
        { icon: faSquareInstagram, href: './instagram', label: 'Instagram' }
    ];

    return (
        <footer>
                <LittleLemonLogo secondary={true} />
            <ul>
                {navigationItems.map((item) => (
                    <li key={item.href} className='footer-links'>
                        <HyperlinkLabel href={item.href} text={item.text} footer={true} />
                    </li>
                ))}
            </ul>
            <div className='social'>
                {socialLinks.map((social) => (
                    <a 
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-hover"
                        style={{
                            display: 'inline-block',
                            padding: '12px',
                            margin: '-12px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                        aria-label={`Visit our ${social.label} page`}
                    >
                        <FontAwesomeIcon 
                            icon={social.icon} 
                            className='icon-social'
                        />
                    </a>
                ))}
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