import React from 'react';

import Header from '../components/Header.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

import ReservationForm from '../components/ReservationForm.js';

function ReservationsPage() {
  return (
    <div className="App">
      <Header />
      <div className="reservation-content" id="main-content">
        <ReservationForm />
      </div>
      <div className="footer-container">
        <Promotion />
        <Footer />
      </div>
    </div>);
}

export default ReservationsPage;
