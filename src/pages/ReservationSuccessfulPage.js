import React from 'react';

import Header from '../components/Header.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

const ReservationSuccessfulPage = () => {
    return (
        <div>
            <Header />
            <h1>Reservation Successful</h1>
            <p>Your reservation has been confirmed. Thank you!</p>
            <Promotion />
            <Footer />
        </div>
    );
};

export default ReservationSuccessfulPage;