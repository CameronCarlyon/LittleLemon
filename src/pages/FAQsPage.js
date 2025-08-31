import React, { useEffect, useRef } from 'react';
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

    useEffect(() => {
        const header = headerRef.current;
        const subheader = subheaderRef.current;
        const faqContainer = faqContainerRef.current;
        const footerText = footerTextRef.current;

        if (!header || !subheader || !faqContainer || !footerText) return;

        // Set initial states
        gsap.set([header, subheader, footerText], {
            opacity: 0,
            y: 30
        });

        // Function to run animations when FAQ items are ready
        const runAnimations = () => {
            // Get all FAQ items (try multiple selectors)
            const faqItems = faqContainer.querySelectorAll('.FAQ, .QA');

            // Set initial states for FAQ items
            gsap.set(faqItems, {
                opacity: 0
            });

            // Create animation timeline
            const tl = gsap.timeline();

            // Animate header first
            tl.to(header, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power2.out",
                delay: 0.1
            })
            // Animate subheader
            .to(subheader, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                delay: 0.1,
                ease: "power2.out"
            }, "-=0.3")
            // Animate FAQ items with stagger
            .to(faqItems, {
                opacity: 1,
                duration: 0.25,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.2")
            // Animate footer text
            .to(footerText, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.3");

            // Store timeline for cleanup
            faqContainer._timeline = tl;
        };

        // Use MutationObserver to detect when FAQ items are added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain FAQ items
                    const hasNewFAQs = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === 1 && (
                            node.classList?.contains('FAQ') || 
                            node.classList?.contains('QA') ||
                            node.querySelector?.('.FAQ, .QA')
                        )
                    );
                    
                    if (hasNewFAQs) {
                        observer.disconnect(); // Stop observing
                        runAnimations();
                    }
                }
            });
        });

        // Start observing the FAQ container
        observer.observe(faqContainer, {
            childList: true,
            subtree: true
        });

        // Also try to run animations immediately in case items are already there
        runAnimations();

        // Cleanup function
        return () => {
            observer.disconnect();
            if (faqContainer._timeline) {
                faqContainer._timeline.kill();
            }
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
