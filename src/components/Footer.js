import React from 'react';
import { Link } from 'react-router-dom';
import lemonLogo from '../assets/lemon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faSquareBluesky, faSquareInstagram } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
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
            <Link to='/home'><img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem'}} className='icon-white'/></Link>
            
            <ul>
                <li><Link to='/menu'>Menu</Link></li>
                <li><Link to='/reservations'>Reservations</Link></li>
                <li><Link to='/our-restaurant'>Our Restaurant</Link></li>
                <li><Link to='/contact-us'>Contact Us</Link></li>
                <li><Link to='/faqs'>FAQs</Link></li>
            </ul>
            <div className='social'>
                <FontAwesomeIcon icon={faSquareFacebook} className='icon-social'/>
                <FontAwesomeIcon icon={faSquareBluesky} className='icon-social'/>
                <FontAwesomeIcon icon={faSquareInstagram} className='icon-social'/>
            </div>
            <h3 className='copyright'>
                {isMobileView ? (
                    <>
                        Crafted by <a href="https://cameroncarlyon.com">Cameron Carlyon</a>
                        <br />
                        All rights reserved
                    </>
                ) : (
                    <>Crafted by <a href="https://cameroncarlyon.com">Cameron Carlyon</a> | All rights reserved</>
                )}
            </h3>
        </footer>
    );
};


export default Footer;