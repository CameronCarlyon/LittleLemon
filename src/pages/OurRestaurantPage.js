import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from '../components/Header.js';
import Divider from '../components/Divider.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

import RestaurantImage from '../assets/images/RestaurantOverview.webp';
import MarioAndAdrianA from '../assets/images/MarioAndAdrianChatting.webp';
import MarioAndAdrianB from '../assets/images/MarioAndAdrianLaughing.webp';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faLocationDot, faClock, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import HyperlinkLabel from '../components/HyperlinkLabel.js';

function OurRestaurantPage() {
    gsap.registerPlugin(ScrollTrigger);

    const [isOpen, setIsOpen] = React.useState(false);
    const [visibleSections, setVisibleSections] = React.useState(new Set());
    const contentRef = useRef(null);
    const timelineRef = useRef(null);

    // Animate the read more/less functionality
    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement) return;

        // Kill any existing animation
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const tl = gsap.timeline();
        timelineRef.current = tl;

        if (isOpen) {
            // Opening animation
            // First, remove the clamp styles to get natural height
            gsap.set(contentElement, {
                WebkitLineClamp: 'unset',
                WebkitBoxOrient: 'unset',
                overflow: 'visible',
                display: 'block',
                height: 'auto'
            });

            // Get the natural height
            const naturalHeight = contentElement.offsetHeight;

            // Set back to clamped state for animation
            gsap.set(contentElement, {
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                display: '-webkit-box',
                height: 'auto'
            });

            // Animate from clamped to natural height
            tl.to(contentElement, {
                height: naturalHeight,
                duration: 0.5,
                ease: 'power2.out'
            })
            .to(contentElement, {
                WebkitLineClamp: 'unset',
                WebkitBoxOrient: 'unset',
                overflow: 'visible',
                display: 'block',
                duration: 0,
            })
            .set(contentElement, {
                height: 'auto' // Allow natural height after animation
            });

        } else {
            // Closing animation
            // Get current height
            const currentHeight = contentElement.offsetHeight;

            // Set to natural display first
            gsap.set(contentElement, {
                height: currentHeight,
                WebkitLineClamp: 'unset',
                WebkitBoxOrient: 'unset',
                overflow: 'visible',
                display: 'block'
            });

            // Temporarily set to clamped to get target height
            gsap.set(contentElement, {
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                display: '-webkit-box',
                height: 'auto'
            });

            const clampedHeight = contentElement.offsetHeight;

            // Set back to current height for animation
            gsap.set(contentElement, {
                height: currentHeight,
                WebkitLineClamp: 'unset',
                WebkitBoxOrient: 'unset',
                overflow: 'hidden', // Keep hidden during animation
                display: 'block'
            });

            // Animate to clamped height
            tl.to(contentElement, {
                height: clampedHeight,
                duration: 0.4,
                ease: 'power2.in'
            })
            .set(contentElement, {
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                display: '-webkit-box',
                height: 'auto'
            });
        }

        // Cleanup function
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [isOpen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, []);

    const handleReadMoreClick = () => {
        setIsOpen(!isOpen);
    };

    // Animate each section in with ScrollTrigger
    const sectionRefs = useRef([]);

    useEffect(() => {
        sectionRefs.current.forEach((section, idx) => {
            if (!section) return;
            gsap.fromTo(
                section,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                        onEnter: () => {
                            // Mark section as visible for divider animation
                            setVisibleSections(prev => new Set([...prev, idx]));
                        },
                        onLeave: () => {
                            // Remove section from visible set when scrolling past
                            setVisibleSections(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(idx);
                                return newSet;
                            });
                        },
                        onEnterBack: () => {
                            // Re-add section when scrolling back up
                            setVisibleSections(prev => new Set([...prev, idx]));
                        },
                        onLeaveBack: () => {
                            // Remove section when scrolling back up past it
                            setVisibleSections(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(idx);
                                return newSet;
                            });
                        }
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [setVisibleSections]);

    return (
        <div className="App">
            <Header />
            <div className="main-content" id="main-content">
                <article>
                    <div
                        className='flex-column'
                        ref={el => (sectionRefs.current[0] = el)}
                    >
                        <div>
                            <h1>Our Restaurant</h1>
                            <p>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
                        </div>
                        <figure className="showcase-img">
                            <img 
                                src={RestaurantImage} 
                                alt="Outdoor dining area of our restaurant featuring modern decor." 
                                loading="lazy"
                            />
                        </figure>
                        <div className='icon-info-container'>
                            <FontAwesomeIcon icon={faBars} />
                            <div>
                                <div
                                    ref={contentRef}
                                    style={{
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                    }}
                                >
                                    <p>
                                        Nestled in the heart of Chicago, Little Lemon is conveniently located at 1358 Chestnut Street, making it easily accessible for both locals and visitors. Our restaurant features a charming blend of modern and rustic Mediterranean design, creating a warm and inviting atmosphere for all our guests.
                                        <br /><br />
                                        We offer both indoor and outdoor seating, with a beautifully designed patio area perfect for al fresco dining. Inside, our spacious dining area features elegant decor, soft lighting, and a welcoming ambiance that makes every meal special.
                                        <br /><br />
                                        For those who prefer a more intimate dining experience, we have private dining spaces available for special occasions and events. Additionally, our open kitchen allows guests to watch our skilled chefs at work, adding a touch of authenticity to your meal.
                                        <br /><br />
                                        Parking is available on-site, with additional street parking nearby. We are also wheelchair accessible, ensuring a comfortable experience for all guests.
                                    </p>
                                </div>
                                <div>
                                    <div
                                        className='read-more'
                                        onClick={handleReadMoreClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {isOpen ? 'Show less' : 'Read more...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex-row'>
                            <div>
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                            <p>
                                1358 Chestnut St. <br />Chicago<br />IL 60680<br />
                                <HyperlinkLabel text='Get Directions' href=''/>
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
                        <div className='flex-row'>
                            <FontAwesomeIcon icon={faBookOpen} />
                            <HyperlinkLabel text='View our full menu.' href='/menu'/>
                        </div>
                    </div>
                    <div
                        className='flex-column'
                        ref={el => (sectionRefs.current[1] = el)}
                    >
                        <div>
                            <h1>A Bit About Us</h1>
                            <Divider color={'var(--color-green)'} triggerAnimation={visibleSections.has(1)} />
                        </div>
                        <p>Welcome to Little Lemon, where Mediterranean tradition meets modern flavors! We are a family-owned restaurant dedicated to serving authentic, flavorful dishes inspired by the sun-soaked coasts of Greece, Turkey, Morocco, and beyond. Whether you're here for a hearty meal or a light bite, we invite you to experience the warmth of our kitchen and hospitality.</p>
                    </div>
                    <figure className="showcase-img">
                        <img 
                            src={MarioAndAdrianB} 
                            alt="Mario and Adrian cooking together." 
                            loading="lazy"
                        />
                    </figure>
                    <div
                        className='flex-column'
                        ref={el => (sectionRefs.current[2] = el)}
                    >
                        <div>
                            <h1>Our Story</h1>
                            <Divider color={'var(--color-green)'} triggerAnimation={visibleSections.has(2)} />
                        </div>
                        <p>Little Lemon was founded with a simple mission: to bring the rich and diverse flavors of the Mediterranean to our community. Our journey began with cherished family recipes passed down through generations, paired with a passion for fresh ingredients and innovative cooking. Today, we continue to honor our heritage while adding a modern twist to classic dishes, creating a unique dining experience that blends tradition and creativity.</p>
                    </div>
                    <div
                        className='flex-column'
                        ref={el => (sectionRefs.current[3] = el)}
                    >
                        <div>
                            <h1>Our Philosophy & Values</h1>
                            <Divider color={'var(--color-green)'} triggerAnimation={visibleSections.has(3)} />
                        </div>
                        <p>At Little Lemon, we believe that food should be fresh, flavorful, and made with love. We prioritize locally sourced ingredients, high-quality spices, and traditional cooking techniques to ensure every bite is an experience. Our team is dedicated to creating a welcoming environment where every guest feels like family.</p>
                        <p>We are also committed to sustainability, minimizing food waste, and using eco-friendly packaging wherever possible. Our menu celebrates seasonal ingredients, ensuring that every dish is bursting with flavor and nutrition.</p>
                    </div>
                    <figure className="showcase-img">
                        <img 
                                src={MarioAndAdrianA} 
                                alt="Mario and Adrian cooking together." 
                                loading="lazy"
                        />
                    </figure>
                    <div
                        className='flex-column'
                        ref={el => (sectionRefs.current[4] = el)}
                    >
                        <div>
                            <h1>Our Menu & Specialties</h1>
                            <Divider color={'var(--color-green)'} triggerAnimation={visibleSections.has(4)} />
                        </div>
                        <p>Our menu features a carefully curated selection of Mediterranean delights, from hearty slow-cooked lamb tagine to refreshing quinoa salads. Guests rave about our signature Shakshuka, fragrant Seafood Paella, and indulgent Baklava Cheesecake. Whether you're craving a light mezze platter or a full-course meal, there's something for everyone at Little Lemon.</p>
                        <p>We also offer daily specials that showcase the best seasonal ingredients, crafted by our talented chefs to bring new and exciting flavors to your table.</p>
                    </div>
                    <div
                        className='flex-column'
                        ref={el => (sectionRefs.current[5] = el)}
                    >
                        <div>
                            <h1>The Dining Experience</h1>
                            <Divider color={'var(--color-green)'} triggerAnimation={visibleSections.has(5)} />
                        </div>
                        <p>Step into Little Lemon and immerse yourself in a cozy, inviting atmosphere that blends Mediterranean charm with a modern touch. Our warm wooden interiors, soft lighting, and vibrant greenery create the perfect setting for a relaxed meal with family and friends. Whether you're dining inside or enjoying the fresh air on our outdoor patio, every visit is designed to be a memorable experience.</p>
                        <p>For a more interactive experience, our open kitchen allows guests to watch our chefs at work, preparing meals with passion and precision. Our friendly staff is always on hand to recommend dishes and ensure you have an exceptional dining experience.</p>
                    </div>
                </article>
            </div>
            <Promotion />
            <Footer />
        </div>
    );
}

export default OurRestaurantPage;
