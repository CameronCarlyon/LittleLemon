import React from 'react';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import MarioAndAdrianA from '../assets/Mario and Adrian A.jpg';
import MarioAndAdrianB from '../assets/Mario and Adrian b.jpg';

function AboutUsPage() {
  return (
    <div className="App">
      <Header />
        <article>
            <div>
                <h1>A Bit About Us</h1>
                <p>Welcome to Little Lemon, where Mediterranean tradition meets modern flavors! We are a family-owned restaurant dedicated to serving authentic, flavorful dishes inspired by the sun-soaked coasts of Greece, Turkey, Morocco, and beyond. Whether you're here for a hearty meal or a light bite, we invite you to experience the warmth of our kitchen and hospitality.</p>
            </div>
            <img src={MarioAndAdrianB} alt="Mario and Adrian" style={{ maxWidth: '100%', height: '20rem', objectFit: 'cover', objectPosition: '0% 100%'  }}/>
            <div>
              <h1>Our Story</h1>
                <p>Little Lemon was founded with a simple mission: to bring the rich and diverse flavors of the Mediterranean to our community. Our journey began with cherished family recipes passed down through generations, paired with a passion for fresh ingredients and innovative cooking. Today, we continue to honor our heritage while adding a modern twist to classic dishes, creating a unique dining experience that blends tradition and creativity.</p>  
            </div>
            <div>
               <h1>Our Philosophy & Values</h1>
                <p>At Little Lemon, we believe that food should be fresh, flavorful, and made with love. We prioritize locally sourced ingredients, high-quality spices, and traditional cooking techniques to ensure every bite is an experience. Our team is dedicated to creating a welcoming environment where every guest feels like family.</p>
                <p>We are also committed to sustainability, minimizing food waste, and using eco-friendly packaging wherever possible. Our menu celebrates seasonal ingredients, ensuring that every dish is bursting with flavor and nutrition.</p>
            </div>
            <img src={MarioAndAdrianA} alt="Mario and Adrian" style={{ maxWidth: '100%', height: '20rem', objectFit: 'cover', objectPosition: '0% 40%' }}/>
            <div>
               <h1>Our Menu & Specialties</h1>
                <p>Our menu features a carefully curated selection of Mediterranean delights, from hearty slow-cooked lamb tagine to refreshing quinoa salads. Guests rave about our signature Shakshuka, fragrant Seafood Paella, and indulgent Baklava Cheesecake. Whether you’re craving a light mezze platter or a full-course meal, there’s something for everyone at Little Lemon.</p>
                <p>We also offer daily specials that showcase the best seasonal ingredients, crafted by our talented chefs to bring new and exciting flavors to your table.</p>
            </div>
            <div>
               <h1>The Dining Experience</h1>
                <p>Step into Little Lemon and immerse yourself in a cozy, inviting atmosphere that blends Mediterranean charm with a modern touch. Our warm wooden interiors, soft lighting, and vibrant greenery create the perfect setting for a relaxed meal with family and friends. Whether you're dining inside or enjoying the fresh air on our outdoor patio, every visit is designed to be a memorable experience.</p>
                <p>For a more interactive experience, our open kitchen allows guests to watch our chefs at work, preparing meals with passion and precision. Our friendly staff is always on hand to recommend dishes and ensure you have an exceptional dining experience.</p> 
            </div>
        </article>
      <Footer />
    </div>);
}

export default AboutUsPage;
