import React from 'react';

const Order = () => {
    return (
        <div className='order'>
            <h1>Order For Delivery!</h1>
            <ul>
                <li>Breakfast</li>
                <li>Lunch</li>
                <li>Mains</li>
                <li>Desserts</li>
                <li>A La Carte</li>
                <li>Specials</li>
                <li>Drinks</li>
            </ul>
            {/* <div className='button'>View Full Menu</div> */}
        </ div>
    );
};

export default Order;