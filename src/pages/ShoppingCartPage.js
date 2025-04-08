import React from 'react';


import Header from '../components/Header.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faStore } from '@fortawesome/free-solid-svg-icons';


function ShoppingCartPage() {
  return (
    <div className='app'>
      <Header />
        <div className='basket-container'>
            <div>
              <h3>Order</h3>
              <h3>Delivery</h3>
              <div className='order-summary'>
                
                <div className='delivery-option'>
                  <FontAwesomeIcon icon={faMotorcycle} />
                  <div>Home Delivery</div>
                  <div><b></b></div>
                  <div><b>$4.99</b></div>
                </div>
                <div className='delivery-option'>
                  <FontAwesomeIcon icon={faStore} />
                  <div>Store Pickup</div>
                  <div><b>$0.00</b></div>
                </div>
              </div>
              <h3>Payment</h3>
          </div>
          <div>
            <h3>Payment Summary</h3>
          </div>          
        </div>
      <Promotion />
      <Footer />
    </div>
  );
}

export default ShoppingCartPage;
