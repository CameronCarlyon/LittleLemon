import React from 'react';
import Header from '../components/Header.js';
import Hero from '../components/Hero.js';
import Menu from '../components/Menu.js';
import Promotion from '../components/Promotion'
import Footer from '../components/Footer.js';

function MainPage() {
  return (
    <div className="App">
        <div>
            <Header />
        <Hero />
        <div className='main-content' id='main-content'>
            <h1>Order for delivery!</h1>
            <Menu/>
        </div>
        </div>
        <div className="footer-container">
            <Promotion />
            <Footer />
        </div>
    </div>);
}

export default MainPage;