import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import FAQ from '../components/FAQ.js';
import Promotion from '../components/Promotion.js';

function FAQsPage() {
  return (
    <div>
      <Header />
        <div className="main-content">
            <h1>Common Questions</h1>
            <FAQ />
        </div>
        <Promotion />
      <Footer />
    </div>);
}

export default FAQsPage;
