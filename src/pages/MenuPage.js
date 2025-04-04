import React from 'react';
import Menu from '../components/Menu.js';
import Header from '../components/Header.js';
import Promotion from '../components/Promotion.js';
import Footer from '../components/Footer.js';

function MainPage() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <h1>Menu</h1>
            <p>Explore our delicious Mediterranean menu, featuring a variety of dishes made with fresh ingredients and traditional recipes.</p>
        <Menu/>
      </div>
      <Promotion />
      <Footer />
    </div>);
}

export default MainPage;
