import React from 'react';
import Header from '../components/Header.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

import { Link } from 'react-router-dom';

import RestaurantImage from '../assets/restaurant.jpg';
import MarioAndAdrianA from '../assets/Mario and Adrian A.jpg';
import MarioAndAdrianB from '../assets/Mario and Adrian b.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faLocationDot, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons'

const paragraphStyles = {
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
}

function OurRestaurantPage() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [showReadMoreButton, setShowReadMoreButton] = React.useState(false);
    
return (
    <div className="App">
        <Header />
            <div className="main-content">
                <article>
                   <h1>Our Restaurant</h1>
                    <p>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
                    <img src={RestaurantImage} alt="Our Restaurant" style={{ maxWidth: '100%', height: '15rem', objectFit: 'cover'}} className='showcase-img'/>
                    <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faBars} />
                            <div>
                              <div style={isOpen ? null : paragraphStyles}>
                                <p>
                                    Nestled in the heart of Chicago, Little Lemon is conveniently located at 1358 Chestnut Street, making it easily accessible for both locals and visitors. Our restaurant features a charming blend of modern and rustic Mediterranean design, creating a warm and inviting atmosphere for all our guests.
                                </p><br></br>
                                <p>
                                    We offer both indoor and outdoor seating, with a beautifully designed patio area perfect for al fresco dining. Inside, our spacious dining area features elegant decor, soft lighting, and a welcoming ambiance that makes every meal special.
                                </p><br></br>
                                <p>
                                    For those who prefer a more intimate dining experience, we have private dining spaces available for special occasions and events. Additionally, our open kitchen allows guests to watch our skilled chefs at work, adding a touch of authenticity to your meal.
                                </p><br></br>
                                <p>
                                    Parking is available on-site, with additional street parking nearby. We are also wheelchair accessible, ensuring a comfortable experience for all guests.
                                </p>
                            </div>
                            <div>
                            <div className='read-more' onClick={() => setIsOpen(!isOpen)}>Read {isOpen ? 'less' : 'more...'}</div>
                            </div>
                        </div>
                    </div>
                    <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faLocationDot} />
                            <p>
                            1358 Chestnut St. <br />Chicago<br />IL 60680<br />
                            <p><a href='maps.google.com'>Get Directions</a></p>
                            </p>
                    </div>
                    <div className='icon-info-container'>
                    <FontAwesomeIcon icon={faClock} />
                    <p className='opening-time'><b>Monday:</b> 10:30 AM - 11:00 PM</p>
                    <p className='opening-time'><b>Tuesday:</b> 10:30 AM - 11:00 PM</p>
                    <p className='opening-time'><b>Wednesday:</b> 10:30 AM - 11:00 PM</p>
                    <p className='opening-time'><b>Thursday:</b> 10:30 AM - 11:00 PM</p>
                    <p className='opening-time'><b>Friday:</b> 10:30 AM - 11:00 PM</p>
                    <p className='opening-time'><b>Saturday:</b> 12:00 PM - 9:00 PM</p>
                    <p className='opening-time'><b>Sunday:</b> Closed</p>
                    </div>
                    <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faBookOpen} />
                            <Link to='/menu' className='link'>View our full menu.</Link>
                    </div>
                <h1>A Bit About Us</h1>
                <p>Welcome to Little Lemon, where Mediterranean tradition meets modern flavors! We are a family-owned restaurant dedicated to serving authentic, flavorful dishes inspired by the sun-soaked coasts of Greece, Turkey, Morocco, and beyond. Whether you're here for a hearty meal or a light bite, we invite you to experience the warmth of our kitchen and hospitality.</p>
            <img src={MarioAndAdrianB} alt="Mario and Adrian" style={{ maxWidth: '100%', height: '20rem', objectFit: 'cover', objectPosition: '0% 70%'  }} className='showcase-img'/>
              <h1>Our Story</h1>
                <p>Little Lemon was founded with a simple mission: to bring the rich and diverse flavors of the Mediterranean to our community. Our journey began with cherished family recipes passed down through generations, paired with a passion for fresh ingredients and innovative cooking. Today, we continue to honor our heritage while adding a modern twist to classic dishes, creating a unique dining experience that blends tradition and creativity.</p>  
               <h1>Our Philosophy & Values</h1>
                <p>At Little Lemon, we believe that food should be fresh, flavorful, and made with love. We prioritize locally sourced ingredients, high-quality spices, and traditional cooking techniques to ensure every bite is an experience. Our team is dedicated to creating a welcoming environment where every guest feels like family.</p>
                <p>We are also committed to sustainability, minimizing food waste, and using eco-friendly packaging wherever possible. Our menu celebrates seasonal ingredients, ensuring that every dish is bursting with flavor and nutrition.</p>
            <img src={MarioAndAdrianA} alt="Mario and Adrian" style={{ maxWidth: '100%', height: '20rem', objectFit: 'cover', objectPosition: '0% 20%' }} className='showcase-img'/>
               <h1>Our Menu & Specialties</h1>
                <p>Our menu features a carefully curated selection of Mediterranean delights, from hearty slow-cooked lamb tagine to refreshing quinoa salads. Guests rave about our signature Shakshuka, fragrant Seafood Paella, and indulgent Baklava Cheesecake. Whether you’re craving a light mezze platter or a full-course meal, there’s something for everyone at Little Lemon.</p>
                <p>We also offer daily specials that showcase the best seasonal ingredients, crafted by our talented chefs to bring new and exciting flavors to your table.</p>
               <h1>The Dining Experience</h1>
                <p>Step into Little Lemon and immerse yourself in a cozy, inviting atmosphere that blends Mediterranean charm with a modern touch. Our warm wooden interiors, soft lighting, and vibrant greenery create the perfect setting for a relaxed meal with family and friends. Whether you're dining inside or enjoying the fresh air on our outdoor patio, every visit is designed to be a memorable experience.</p>
                <p>For a more interactive experience, our open kitchen allows guests to watch our chefs at work, preparing meals with passion and precision. Our friendly staff is always on hand to recommend dishes and ensure you have an exceptional dining experience.</p> 
            </article>
        </div>
        <Promotion />
        <Footer />
    </div>);
}

export default OurRestaurantPage;
