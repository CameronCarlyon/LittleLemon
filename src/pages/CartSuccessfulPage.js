import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

const CartSuccessfulPage = () => {
    const location = useLocation();
    const orderData = location.state?.orderData;
    const orderItems = location.state?.orderItems || []; // Use stored items instead of cartItems

    const collectionTime = (() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30); // Add 30 minutes
        
        const minutes = now.getMinutes();
        const remainder = minutes % 15;
        if (remainder > 0) {
            now.setMinutes(minutes + (15 - remainder));
        }
        
        return now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    })();
    
    const orderNumber = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
                            letters.charAt(Math.floor(Math.random() * letters.length));
        const randomNumbers = Math.floor(10000 + Math.random() * 90000);
        return randomLetters + randomNumbers;
    };

    return (
        <div>
            <Header />
            <div>
                <div className="reservation-details">
                    <h1>Order Confirmed!</h1>
                    <div className="reservation-card">
                        <p>Order Items</p>
                        <div className="order-items">
                            <ul>
                            {orderItems.map((item, index) => ( // Use orderItems instead of cartItems
                                    <li key={index} className="order-item">
                                        <div className='cart-item-details-left'>
                                            <p><b>{item.name}</b></p>
                                            <p><b>${(item.price * item.quantity).toFixed(2)}</b></p>
                                        </div>
                                        <div className='cart-item-details-right'>
                                            <p>x{item.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p>Order Number</p>
                            <p><b>{orderNumber()}</b></p>
                        </div>
                        <div>
                            <p>Name</p>
                            <p><b>{orderData?.fullName}</b></p>
                        </div>
                        <div>
                            <p>Delivery Method</p>
                            <p><b>{orderData?.deliveryMethod === 'homeDelivery' ? 'Home Delivery' : 'Store Pickup'}</b></p>
                        </div>
                        {orderData?.deliveryMethod === 'homeDelivery' && (
                            <div>
                                <p>Delivery Address</p>
                                <p><b>{orderData?.address}</b></p>
                                <p><b>{orderData?.city}</b></p>
                                <p><b>{orderData?.state}</b></p>
                                <p><b>{orderData?.zip}</b></p>
                            </div>
                        )}
                        <div>
                            <p>{orderData?.deliveryMethod === 'storePickup' ? 'Estimated Collection Time' : 'Estimated Delivery Time'}</p>
                            <p><b>{orderData?.deliveryMethod === 'storePickup' ? collectionTime : new Date(Date.now() + 40 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b></p>
                        </div>
                        <div>
                            <p>Contact</p>
                            <p><b>{orderData?.emailAddress}</b></p>
                        </div>
                            <div>
                                <p>Subtotal: <b>${location.state?.pricing.subtotal.toFixed(2)}</b></p>
                                {location.state?.pricing.tip > 0 && (
                                    <p>Tip: <b>${location.state?.pricing.tip.toFixed(2)}</b></p>
                                )}
                                <p>Service Fee: <b>${location.state?.pricing.serviceFee.toFixed(2)}</b></p>
                                {location.state?.pricing.deliveryFee > 0 && (
                                    <p>Delivery Fee: <b>${location.state?.pricing.deliveryFee.toFixed(2)}</b></p>
                                )}
                                <p>Sales Tax: <b>${location.state?.pricing.salesTax.toFixed(2)}</b></p>
                                <p>Restaurant Tax: <b>${location.state?.pricing.restaurantTax.toFixed(2)}</b></p>
                            </div>
                            <div>
                                <p><b>Total: ${location.state?.pricing.total.toFixed(2)}</b></p>
                            </div>
                    </div>
                    <p>Thank you for your order. Your order is being processed.</p>
                    <p>You will receive a confirmation email shortly at <b><i>{orderData?.emailAddress}</i></b></p>
                    {orderData?.deliveryMethod === 'storePickup' && (
                    <p>First time visiting our restaurant? You can find out all you need to know <Link to={'/our-restaurant'}>here.</Link></p>)}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartSuccessfulPage;