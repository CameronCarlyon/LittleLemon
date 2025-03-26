import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import MainPage from './pages/MainPage.js';
import MenuPage from './pages/MenuPage.js';
import AboutUsPage from './pages/AboutUsPage.js';
import OurRestaurantPage from './pages/OurRestaurantPage.js';
import ContactUsPage from './pages/ContactUsPage.js';
import FAQsPage from './pages/FAQsPage.js';
import NoPage from './pages/NoPage.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<MainPage />} />
          <Route path='/home' element={<MainPage />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/about-us' element={<AboutUsPage />} />
          <Route path='/our-restaurant' element={<OurRestaurantPage />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          <Route path='/faqs' element={<FAQsPage />} />
          <Route path='*' element={<NoPage />} />
        </Routes>
      </BrowserRouter> 
    </div>);
}

export default App;
