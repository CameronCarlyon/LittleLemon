import React from 'react';

let FAQs = [
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
    const [visibleIndex, setVisibleIndex] = React.useState(null);

    return (
        <div className='FAQ'>
              {FAQs.map((faq, index) => (
                <div 
                    className='QA' 
                    key={index} 
                    onClick={() => setVisibleIndex(visibleIndex === index ? null : index)}>
                    <p style={{ fontWeight: 'bold', color: '#495E57' }}>{faq.question}</p>
                    {visibleIndex === index && <p style={{ marginTop: '5px', color: '#333' }}>{faq.answer}</p>}
                </div>
              ))}  
        </div>
    );
};

export default FAQ;