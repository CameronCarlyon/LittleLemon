import React from 'react';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { Link } from 'react-router-dom';

let noPageMessages = [
    "This page vanished quicker than lemonade on a hot day!",
    "When life gives you lemons, but not the page you were looking for...",
    "This page is missing... Pulp Fiction?",
    "This page has been squeezed out of existence!",
    "Looks like this page is on a juice cleanse!",
    "We juiced up the website, but this page didn't make the cut!",
    "This page went sour. Try something sweeter!"];

    let randomNoPageMessage = noPageMessages[Math.floor(Math.random() * noPageMessages.length)];

function NoPage() {
  return (
    <div className="no-page">
      <Header />
        <h1 className='no-page-code'>Error 404</h1>
        <h1 className='no-page-message'>{randomNoPageMessage}</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
            <div className='btn-primary'><Link to='/home'>Go Home</Link></div>
            <div className='btn-secondary'><Link to='/contact-us'>Contact Us</Link></div>
        </div>
        
      <Footer />
    </div>);
}

export default NoPage;
