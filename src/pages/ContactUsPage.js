import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Promotion from '../components/Promotion.js';

function ContactUsPage() {
  return (
    <div className="App">
      <Header />
        <div className="main-content">
            <h1>Want to get in touch?</h1>
            <div className="contact-info">
                <div className="contact-details">
                    <div>
                        <h2>Address</h2>
                        <p>1358 Chestnut St. <br />Chicago<br />IL 60680<br />
                                    <p><a href='maps.google.com'>Get Directions</a></p>
                                    </p>
                    </div>
                    <div>
                        <h2>Phone Number</h2>
                        <p>(312) 555-7890</p>
                    </div>
                    <div>
                        <h2>Email Address</h2>
                        <p>contact@littlelemon.com</p>
                    </div>
                </div>
                <div className="contact-form">
                    <input required type="text" placeholder="Your Name" />
                    <input required type="text" placeholder="Your Email Address" />
                    <input required type="text" placeholder="Subject" />
                    <input required type="textarea" placeholder="Message" />
                    <button type="submit">Submit</button>
                </div>
            </div>
                
        </div>
    <Promotion />
    <Footer />
    </div>
  );
}

export default ContactUsPage;
