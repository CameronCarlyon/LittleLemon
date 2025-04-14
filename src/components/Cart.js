import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faStore } from '@fortawesome/free-solid-svg-icons';
import QuantityControl from './QuantityControl';

const Cart = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        deliveryMethod: 'home',
        address: '',
        city: 'Chicago',
        state: 'Illinois',
        zip: '',
        tip: 0
      });
    
      const [errors, setErrors] = useState({});
      const [submitted, setSubmitted] = useState(false);
    
      const { cartItems, removeFromCart, updateQuantity } = useCart();
      
      const [pricing, setPricing] = useState({
        subtotal: 0,
        serviceFee: 0,
        deliveryFee: 0,
        salesTax: 0,
        restaurantTax: 0,
        tip: 0,
        total: 0
      });

      const [customTipAmount, setCustomTipAmount] = useState('');
    
      // Update prices whenever cart or delivery method changes
      useEffect(() => {
        const subtotal = cartItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        const serviceFee = subtotal * 0.2;
        const deliveryFee = formData.deliveryMethod === 'homeDelivery' ? 4.99 : 0;
        const salesTax = subtotal * 0.1025;      // 10.25% standard sales tax
        const restaurantTax = subtotal * 0.005;   // 0.5% Chicago restaurant tax
        const tip = formData.tip || 0;
        const total = subtotal + serviceFee + deliveryFee + salesTax + restaurantTax + tip;
    
        setPricing({
          subtotal,
          serviceFee,
          deliveryFee,
          salesTax,
          restaurantTax,
          tip,
          total
        });
      }, [cartItems, formData.deliveryMethod, formData.tip]);
    
      const handleDeliveryChange = (method) => {
        setFormData({
          ...formData,
          deliveryMethod: method,
        });
        
        // Clear error when selection is made
        if (errors.deliveryMethod) {
          setErrors({
            ...errors,
            deliveryMethod: null
          });
        }
      };
    
      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
      };
    
      const handleTipChange = (e) => {
        const { value, id } = e.target;
        const subtotal = pricing.subtotal;
        let tipAmount = 0;
    
        // Handle percentage-based tips
        if (id === 'tip1') {
            tipAmount = subtotal * 0.15;
            setCustomTipAmount('');
        } else if (id === 'tip2') {
            tipAmount = subtotal * 0.20;
            setCustomTipAmount('');
        } else if (id === 'tip3') {
            tipAmount = subtotal * 0.25;
            setCustomTipAmount('');
        } else if (id === 'tip4') {
            tipAmount = 0;
            setCustomTipAmount('');
        } else if (id === 'customTip') {
            // Handle custom tip amount
            const customValue = parseFloat(value);
            if (!isNaN(customValue) && customValue >= 0) {
                tipAmount = customValue;
                setCustomTipAmount(value);
            }
        }
    
        setFormData(prev => ({
            ...prev,
            tip: tipAmount
        }));
    };
    
      const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Name is required";
        }
        
        if (!formData.emailAddress.trim()) {
          newErrors.emailAddress = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
          newErrors.emailAddress = "Email is invalid";
        }
        
        if (!formData.cardNumber.trim()) {
          newErrors.cardNumber = "Card number is required";
        }
    
        if (!formData.deliveryMethod) {
          newErrors.deliveryMethod = "Please select a delivery method";
        }
        
        return newErrors;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        
        // Form is valid, proceed with submission
        console.log("Form submitted:", formData);
        setSubmitted(true);
      };
    
      return (
        <div className='app'>
          <div className='main-content'>
            <form className='basket-container' onSubmit={handleSubmit}>
              <div className='form-container'>
                <label>Your Details</label>
                <input 
                  id='fullName' 
                  type='text' 
                  placeholder='Full Name' 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
                <input id='emailAddress' type='text' placeholder='Email Address' required />
                <label>Billing</label>
                <input id='cardNumber' type='text' placeholder='Card Number' required />
                <input id='expiryDate' type='text' placeholder='MM/YY' required />
                <input id='cvv' type='text' placeholder='CVV' required />
                <label>Delivery</label>
                <div className="delivery-options-container">
                  <div>
                    <label 
                      className={`delivery-option ${formData.deliveryMethod === 'storePickup' ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="storePickup"
                        checked={formData.deliveryMethod === 'storePickup'}
                        onChange={() => handleDeliveryChange('storePickup')}
                        className="delivery-radio-input"
                        required
                      />
                      <div className="delivery-option-content">
                        <FontAwesomeIcon icon={faStore} className="delivery-icon" />
                        <p className="delivery-label">Store Pickup</p>
                        <p className="delivery-price">$0.00</p>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label 
                      className={`delivery-option ${formData.deliveryMethod === 'homeDelivery' ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="homeDelivery"
                        checked={formData.deliveryMethod === 'homeDelivery'}
                        onChange={() => handleDeliveryChange('homeDelivery')}
                        className="delivery-radio-input"
                        required
                      />
                      <div className="delivery-option-content">
                        <FontAwesomeIcon icon={faMotorcycle} className="delivery-icon" />
                        <p className="delivery-label">Home Delivery</p>
                        <p className="delivery-price">$4.99</p>
                      </div>
                    </label>
                  </div>
                </div>
            
                {errors.deliveryMethod && (
                  <p className="error-message">{errors.deliveryMethod}</p>
                )}
                
                {formData.deliveryMethod === 'homeDelivery' && (
                  <>
                    <label>Delivery Address</label>
                    <input id='address' type='text' placeholder='Address' required />
                    <p className='prefilled'>{formData.city}</p>
                    <p className='prefilled'>{formData.state}</p>
                    <input id='zip' type='text' placeholder='Zip Code' required />
                  </>
                )}
              </div>
              <div className='form-container'>
                <label>Order Summary</label>
                <div className='order-summary-container'>
                  <ul>
                  {cartItems.map((item, index) => (
                    <li key={index} className="cart-item">
                      <div className="cart-item-details">
                        <div>{item.name}</div>
                        <div>${item.price.toFixed(2)}</div>
                      </div>
                      <QuantityControl 
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.name, item.quantity + 1)}
                        onDecrease={() => {
                          if (item.quantity <= 1) {
                            removeFromCart(item.name);
                          } else {
                            updateQuantity(item.name, item.quantity - 1);
                          }
                        }}
                        minQuantity={1}
                      />
                    </li>
                  ))}
                </ul>
                <span></span>
                <div className='order-summary-additions'>
                <p>Subtotal: ${pricing.subtotal.toFixed(2)}</p>
                {pricing.tip > 0 && (
                    <p>Tip: ${pricing.tip.toFixed(2)}</p>
                  )}
                <p>Service Fee: ${pricing.serviceFee.toFixed(2)}</p>
                {pricing.deliveryFee > 0 && (
                    <p>Delivery Fee: ${pricing.deliveryFee.toFixed(2)}</p>
                  )}
                <p>Sales Tax: ${pricing.salesTax.toFixed(2)}</p>
                <p>Chicago Restaurant Tax: ${pricing.restaurantTax.toFixed(2)}</p>
                </div>
                <span></span>
                  <p><b>Total: ${pricing.total.toFixed(2)}</b></p>
                </div>
                <label>Add a Tip</label>
                <div className='tip-container'>
                  <div>
                    <div className='tip-option'>
                      <input 
                          type='radio' 
                          id='tip1' 
                          name='tip' 
                          onChange={handleTipChange}
                          checked={formData.tip === pricing.subtotal * 0.15}
                      />
                      <label htmlFor='tip1'>15%</label>
                      <label htmlFor='tip1'>${(pricing.subtotal * 0.15).toFixed(2)}</label>
                    </div>
                    <div className='tip-option'>
                      <input 
                          type='radio' 
                          id='tip2' 
                          name='tip' 
                          onChange={handleTipChange}
                          checked={formData.tip === pricing.subtotal * 0.20}
                      />
                      <label htmlFor='tip2'>20%</label>
                      <label htmlFor='tip2'>${(pricing.subtotal * 0.20).toFixed(2)}</label>
                    </div>
                    <div className='tip-option'>
                      <input 
                          type='radio' 
                          id='tip3' 
                          name='tip' 
                          onChange={handleTipChange}
                          checked={formData.tip === pricing.subtotal * 0.25}
                      />
                      <label htmlFor='tip3'>25%</label>
                      <label htmlFor='tip3'>${(pricing.subtotal * 0.25).toFixed(2)}</label>
                    </div>
                  </div>
                    <div className='custom-tip-input'>
                        <label htmlFor='customTip'>Custom Tip: $</label>
                        <input 
                            type='number' 
                            id='customTip' 
                            placeholder='0.00'
                            onChange={handleTipChange}
                            value={customTipAmount}
                            min="0"
                            step="0.01"
                            aria-label="Custom tip amount"
                        />
                    </div>

                  <div className='tip-option'>
                      <input 
                          type='radio' 
                          id='tip4' 
                          name='tip' 
                          onChange={() => handleTipChange({ target: { value: 0 }})}
                          checked={formData.tip === 0}
                      />
                      <label htmlFor='tip4'>No Tip</label>
                  </div>
                </div>
                <div className='checkbox-container'>
                  <label htmlFor='terms'>I agree to the <Link to=''>Terms and Conditions</Link></label>
                  <input type='checkbox' id='terms' required />
                </div>
                <button type='submit' className='btn-form' onClick={() => alert('Order placed!')}>Place Order</button>
              </div> 
            </form>
          </div>
        </div>
      );
};

export default Cart;