import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import HyperlinkLabel from '../components/HyperlinkLabel.js';
import FAQ from '../components/FAQ.js';
import Promotion from '../components/Promotion.js';

function FAQsPage() {
    const headerRef = useRef(null);
    const subheaderRef = useRef(null);
    const faqContainerRef = useRef(null);
    const footerTextRef = useRef(null);

    useLayoutEffect(() => {
        const header = headerRef.current;
        const subheader = subheaderRef.current;
        const faqContainer = faqContainerRef.current;
        const footerText = footerTextRef.current;

        if (!header || !subheader || !faqContainer || !footerText) return;

        const ctx = gsap.context(() => {
            const faqItems = faqContainer.querySelectorAll('.QA');
            if (!faqItems.length) return;

            // Set all start states before first paint to prevent flashing.
            gsap.set([header, subheader, footerText], {
                opacity: 0,
                y: 30
            });
            gsap.set(faqItems, {
                opacity: 0,
                y: 20
            });

            const tl = gsap.timeline();

            tl.to(header, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power2.out",
                delay: 0.1
            })
            .to(subheader, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power2.out"
            }, "-=0.3")
            .to(faqItems, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                stagger: 0.08,
                ease: "power2.out"
            }, "-=0.2")
            .to(footerText, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power2.out"
            }, "-=0.3");
        });

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div>
            <Header />
                <div className="main-content" id="main-content">
                    <section aria-label="Frequently Asked Questions" className='flex-column'>
                        <div>
                            <h1 ref={headerRef}>Frequently Asked Questions</h1>
                            <p ref={subheaderRef}>Looking for answers? You may find them in the FAQs below.</p>
                        </div>
                        
                        <div ref={faqContainerRef}>
                            <FAQ />
                        </div>
                        <p ref={footerTextRef}>Still have questions? Feel free to <HyperlinkLabel text="reach out to us directly." href='/contact-us' /></p>
                    </section>
                </div>
                <Promotion />
            <Footer />
        </div>
    );
}

export default FAQsPage;
