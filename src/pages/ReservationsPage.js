import React from 'react';

import Header from '../components/Header.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

import ReservationForm from '../components/ReservationForm.js';

function AboutUsPage() {
  return (
    <div className="App">
      <Header />
      <div className="reservation-content">
        <ReservationForm />
        {/* <img src={RestaurantFood} alt="Restaurant Food" className='showcase-img' /> */}
      </div>
      <Promotion />
      <Footer />
    </div>);
}

export default AboutUsPage;
