import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { CartProvider } from './context/CartContext.js';
import MainPage from './pages/MainPage.js';
import MenuPage from './pages/MenuPage.js';
import ReservationsPage from './pages/ReservationsPage.js';
import OurRestaurantPage from './pages/OurRestaurantPage.js';
import ContactUsPage from './pages/ContactUsPage.js';
import FAQsPage from './pages/FAQsPage.js';
import ShoppingCartPage from './pages/ShoppingCartPage.js';
import NoPage from './pages/NoPage.js';
import ReservationSuccessfulPage from './pages/ReservationSuccessfulPage.js';

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route index element={<MainPage />} />
          <Route path='/home' element={<MainPage />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/reservations' element={<ReservationsPage />} />
          <Route path='/our-restaurant' element={<OurRestaurantPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          <Route path='/faqs' element={<FAQsPage />} />
          <Route path='/shopping-cart' element={<ShoppingCartPage />} />
          <Route path='/reservations/success' element={<ReservationSuccessfulPage />} />
          <Route path='*' element={<NoPage />} />
        </Routes>
      </BrowserRouter> 
      </CartProvider>
    </div>);
}

export default App;
