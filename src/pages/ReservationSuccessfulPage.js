import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Promotion from '../components/Promotion';
import Footer from '../components/Footer';

const ReservationSuccessfulPage = () => {
    const location = useLocation();
    const reservationData = location.state?.reservationData;

    return (
        <div>
            <Header />
            <div className="reservation-details">
                <h1>Booking Successful!</h1>
                <h3>We Look Forward to Welcoming You!</h3>
                <div className="reservation-card">
                    <div>
                        <p>Name</p>
                        <p><strong>{reservationData?.fullName}</strong></p>
                    </div>
                    <div>
                        <p>Date</p>
                        <p><strong>{reservationData?.reservationDate}</strong></p>
                    </div>
                    <div>
                        <p>Time</p>
                        <p><strong>{reservationData?.reservationTime}</strong></p>
                    </div>
                    <div>
                        <p>Guests</p>
                        <p><strong>{reservationData?.guestCount}</strong></p>
                    </div>
                    {reservationData?.occasion !== 'none' && (
                        <div>
                            <p>Occasion</p>
                            <p><strong>{reservationData?.occasion}</strong></p>
                        </div>
                        )}
                    {reservationData?.specialRequests && (
                        <div>
                            <p>Special Requests</p>
                            <p><strong>{reservationData?.specialRequests}</strong></p>
                        </div>
                    )}
                    <div>
                        <p>Contact</p>
                        <p><strong>{reservationData?.emailAddress}</strong></p>
                    </div>
                </div>
                <p className="confirmation-message">
                    A confirmation email has been sent to <strong><i>{reservationData?.emailAddress}</i></strong>
                </p>
                <p>First time visiting our restaurant? You can find out all you need to know <Link to={'/our-restaurant'}>here.</Link></p>
            </div>
            <Promotion />
            <Footer />
        </div>
    );
};

export default ReservationSuccessfulPage;