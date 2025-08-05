import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const FAQ_DATA = [
    {
      question: "What are the restaurant's opening hours?",
      answer: "We are open from Monday to Friday, 10:30 AM to 11:00 PM, and Saturday from 12:00 PM to 9:00 PM. We are closed on Sundays. An extensive list of our opening hours can be found on the 'Our Restaurant' page."
    },
    {
      question: "Do you offer vegetarian or vegan options?",
      answer: "Yes! We have a variety of vegetarian and vegan dishes, including our Quinoa & Chickpea Salad (Vegan, Gluten-Free), Grilled Vegetable Platter (Vegan, Gluten-Free), and Vegan Lentil Soup (Vegan, Gluten-Free)."
    },
    {
      question: "Can I make a reservation?",
      answer: "Yes, we recommend making a reservation, especially on weekends. You can call us at (312) 555-7890 or book online."
    },
    {
        question: "Do you offer takeout or delivery?",
        answer: "Yes, we offer both takeout and delivery services. You can place an order through our website or preferred delivery partners."
    },
    {
        question: "Are you able to accommodate food allergies?",
        answer: "We do our best to accommodate dietary restrictions and allergies. Please inform your server of any allergies, and we will take necessary precautions."
    },
    {
        question: "Do you have gluten-free options?",
        answer: "Yes, we offer several gluten-free dishes, including our Grilled Lamb Chops (Gluten-Free), Mediterranean Chicken (Gluten-Free), and a selection of fresh salads."
    },
    {
        question: "Do you serve alcohol?",
        answer: "Yes, we offer a selection of wines, beers, and Mediterranean-inspired cocktails."
    },
    {
        question: "Is there parking available?",
        answer: "Yes, we have dedicated parking for our guests. Additional street parking is also available nearby."
    },
    {
        question: "Do you offer catering for events?",
        answer: "Yes! We provide catering services for events of all sizes. Contact us for more details."
    },
    {
        question: "Are you family-friendly?",
        answer: "Absolutely! We have a kid-friendly menu and a welcoming environment for families."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept cash, credit/debit cards, and contactless payments."
    },
];

const FAQ = () => {
    const [visibleIndex, setVisibleIndex] = useState(null);
    const answerRefs = useRef([]);
    const timelinesRef = useRef([]); // Individual timeline for each FAQ
    const isInitialized = useRef(false);

    // Initialize refs arrays
    useEffect(() => {
        answerRefs.current = answerRefs.current.slice(0, FAQ_DATA.length);
        timelinesRef.current = timelinesRef.current.slice(0, FAQ_DATA.length);
    }, []);

    // Set initial closed states for all answers
    useEffect(() => {
        const timer = setTimeout(() => {
            answerRefs.current.forEach((ref) => {
                if (ref) {
                    gsap.set(ref, {
                        height: 0,
                        opacity: 0,
                        overflow: 'hidden',
                        marginTop: 0
                    });
                }
            });
            isInitialized.current = true;
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // Animation handler for individual FAQs
    const animateAnswer = useCallback((index, isOpening) => {
        const answerElement = answerRefs.current[index];
        if (!answerElement || !isInitialized.current) return;

        // Kill any existing animation for this specific FAQ
        if (timelinesRef.current[index]) {
            timelinesRef.current[index].kill();
        }

        const tl = gsap.timeline();
        timelinesRef.current[index] = tl;

        if (isOpening) {
            // Opening animation
            gsap.set(answerElement, { height: 'auto' });
            const naturalHeight = answerElement.offsetHeight;
            gsap.set(answerElement, { height: 0 });

            tl.to(answerElement, {
                height: naturalHeight,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(answerElement, {
                opacity: 1,
                marginTop: 5,
                duration: 0.2,
                ease: 'power2.out'
            }, '-=0.1')
            .set(answerElement, { 
                height: 'auto'
            });
        } else {
            // Closing animation
            tl.to(answerElement, {
                opacity: 0,
                marginTop: 0,
                duration: 0.15,
                ease: 'power2.in'
            })
            .to(answerElement, {
                height: 0,
                duration: 0.25,
                ease: 'power2.in'
            }, '-=0.05');
        }

        return tl;
    }, []);

    // Handle FAQ click
    const handleFAQClick = useCallback((index) => {
        if (!isInitialized.current) return;

        const isCurrentlyVisible = visibleIndex === index;
        
        if (isCurrentlyVisible) {
            // Close the currently open FAQ
            animateAnswer(index, false);
            setVisibleIndex(null);
        } else {
            // Close the previously open FAQ (if any)
            if (visibleIndex !== null) {
                animateAnswer(visibleIndex, false);
            }
            
            // Open the new FAQ
            animateAnswer(index, true);
            setVisibleIndex(index);
        }
    }, [visibleIndex, animateAnswer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            timelinesRef.current.forEach(timeline => {
                if (timeline) {
                    timeline.kill();
                }
            });
        };
    }, []);

    return (
        <div className='FAQ'>
            {FAQ_DATA.map((faq, index) => (
                <div
                    className='QA' 
                    key={index} 
                    onClick={() => handleFAQClick(index)}
                >
                    <p style={{ 
                        fontWeight: 'bold',
                        userSelect: 'none' // Prevent text selection on click
                    }}>
                        {faq.question}
                    </p>
                    <div
                        ref={(el) => answerRefs.current[index] = el}
                        style={{ 
                            overflow: 'hidden',
                            height: 0,
                            opacity: 0
                        }}
                    >
                        <p>
                            {faq.answer}
                        </p>
                    </div>
                </div>
            ))}  
        </div>
    );
};

export default FAQ;