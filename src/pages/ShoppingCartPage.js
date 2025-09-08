import React from 'react';
import { useCart } from '../context/CartContext';

import Header from '../components/Header.js';
import CartEmpty from '../components/CartEmpty.js';
import Cart from '../components/Cart.js';
import Footer from '../components/Footer.js';

function ShoppingCartPage() {
  const { cartItems } = useCart();

    return (
        <div>
            <Header />
            {cartItems.length === 0 ? <CartEmpty /> : <Cart />}
            <Footer />
        </div>
    )
}

export default ShoppingCartPage;
