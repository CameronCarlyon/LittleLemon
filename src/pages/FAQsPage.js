import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import HyperlinkLabel from '../components/HyperlinkLabel.js';
import FAQ from '../components/FAQ.js';
import Promotion from '../components/Promotion.js';

function FAQsPage() {
return (
    <div>
        <Header />
            <div className="main-content">
                <article>
                    <div>
                        <h1>Frequently Asked Questions</h1>
                        <p>Looking for answers? You may find them in the FAQs below.</p>
                    </div>
                    
                    <FAQ />
                    <p>Still have questions? Feel free to <Link to={'/contact-us'}><HyperlinkLabel text="reach out to us directly." /></Link></p>
                    </article>
            </div>
            <Promotion />
        <Footer />
    </div>);
}

export default FAQsPage;
