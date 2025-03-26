import React from 'react';
import Header from '../components/Header.js';
import Hero from '../components/Hero.js';
import Order from '../components/Order.js';
import Menu from '../components/Menu.js';
import Footer from '../components/Footer.js';

function MainPage() {
  return (
    <div className="MainPage">
      <Header />
      <Hero />
      <Order />
      <Menu/>
      <Footer />
    </div>);
}

export default MainPage;