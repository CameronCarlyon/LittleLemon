import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

import RestaurantImage from '../assets/restaurant.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faLocationDot, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons'

function OurRestaurantPage() {
return (
    <div className="App">
        <Header />
            <article>
                    <img src={RestaurantImage} alt="Our Restaurant" style={{ maxWidth: '100%', height: '15rem', objectFit: 'cover'}} />
                    <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faBars} />
                            <div>
                                <p>
                                    Nestled in the heart of Chicago, Little Lemon is conveniently located at 1358 Chestnut Street, making it easily accessible for both locals and visitors. Our restaurant features a charming blend of modern and rustic Mediterranean design, creating a warm and inviting atmosphere for all our guests.
                                </p>
                                <p>
                                    We offer both indoor and outdoor seating, with a beautifully designed patio area perfect for al fresco dining. Inside, our spacious dining area features elegant decor, soft lighting, and a welcoming ambiance that makes every meal special.
                                </p>
                                <p>
                                    For those who prefer a more intimate dining experience, we have private dining spaces available for special occasions and events. Additionally, our open kitchen allows guests to watch our skilled chefs at work, adding a touch of authenticity to your meal.
                                </p>
                                <p>
                                    Parking is available on-site, with additional street parking nearby. We are also wheelchair accessible, ensuring a comfortable experience for all guests.
                                </p>
                            </div>
                    </div>
                    <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <p>
                            1358 Chestnut St. <br />Chicago<br />IL 60680<br />
                            </p>
                    </div>
                    <div className='icon-info-container'>
                    <FontAwesomeIcon icon={faClock} />
                    <p><b>Monday:</b> 10:30 AM - 11:00 PM</p>
                    <p><b>Tuesday:</b> 10:30 AM - 11:00 PM</p>
                    <p><b>Wednesday:</b> 10:30 AM - 11:00 PM</p>
                    <p><b>Thursday:</b> 10:30 AM - 11:00 PM</p>
                    <p><b>Friday:</b> 10:30 AM - 11:00 PM</p>
                    <p><b>Saturday:</b> 12:00 PM - 9:00 PM</p>
                    <p><b>Sunday:</b> Closed</p>
                    </div>
                    <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faBookOpen} />
                    </div>
            </article>
        <Footer />
    </div>);
}

export default OurRestaurantPage;
