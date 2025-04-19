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
                <p><b>We Look Forward to Welcoming You!</b></p>
                <div className="reservation-card">
                    <div>
                        <p>Name</p>
                        <p><b>{reservationData?.fullName}</b></p>
                    </div>
                    <div>
                        <p>Date</p>
                        <p><b>{reservationData?.reservationDate}</b></p>
                    </div>
                    <div>
                        <p>Time</p>
                        <p><b>{reservationData?.reservationTime}</b></p>
                    </div>
                    <div>
                        <p>Guests</p>
                        <p><b>{reservationData?.guestCount}</b></p>
                    </div>
                    {reservationData?.occasion !== 'none' && (
                        <div>
                            <p>Occasion</p>
                            <p><b>{reservationData?.occasion}</b></p>
                        </div>
                        )}
                    {reservationData?.specialRequests && (
                        <div>
                            <p>Special Requests</p>
                            <p><b>{reservationData?.specialRequests}</b></p>
                        </div>
                    )}
                    <div>
                        <p>Contact</p>
                        <p><b>{reservationData?.emailAddress}</b></p>
                    </div>
                </div>
                <p className="confirmation-message">
                    A confirmation email has been sent to <b><i>{reservationData?.emailAddress}</i></b>
                </p>
                <p>First time visiting our restaurant? You can find out all you need to know <Link to={'/our-restaurant'}>here.</Link></p>
            </div>
            <Promotion />
            <Footer />
        </div>
    );
};

export default ReservationSuccessfulPage;