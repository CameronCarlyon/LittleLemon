import React from 'react';
import Menu from '../components/Menu.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

function MainPage() {
  return (
    <div className="App">
      <Header />
      <Menu/>
      <Footer />
    </div>);
}

export default MainPage;
