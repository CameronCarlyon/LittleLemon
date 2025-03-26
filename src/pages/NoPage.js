import React from 'react';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';

function NoPage() {
  return (
    <div className="App">
      <Header />
        <h1>404: Page Not Found</h1>
      <Footer />
    </div>);
}

export default NoPage;
