import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header.js';
import ReservationCard from '../components/ReservationCard.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

let reservationCode = (Math.floor(Math.random() * 100000000));

const ReservationSuccessfulPage = () => {
    return (
        <div>
            <Header />
            <div className='main-content'>
                <h1>Reservation Successful</h1>
                <p>We can't wait to welcome you!</p>
                <ReservationCard />
                <div>
                    <p>Reservation Code</p>
                    <h2>{reservationCode}</h2>    
                </div>
                <p>First time experiencing our restaurant? You can find out more information ahead of your visit <Link to='/our-restaurant'>here!</Link></p>
            </div>
            <Promotion />
            <Footer />
        </div>
    );
};

export default ReservationSuccessfulPage;