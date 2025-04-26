import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faStore, faXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import QuantityControl from './QuantityControl';

const Cart = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        deliveryMethod: '',
        address: '',
        city: 'Chicago',
        state: 'Illinois',
        zip: '',
        tip: 0,
        terms: false
      });
    
      const [errors, setErrors] = useState({});
      const [isSubmitted, setIsSubmitted] = useState(false);
      const [submitAttempted, setSubmitAttempted] = useState(false);
      const [isProcessing, setIsProcessing] = useState(false);
    
      const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
      
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

      // State to track selected tip percentage
      const [selectedTipPercentage, setSelectedTipPercentage] = useState(0);

      // Update the calculateTipAmount function
      const calculateTipAmount = (subtotal) => {
        if (selectedTipPercentage === 0.15) return subtotal * 0.15;
        if (selectedTipPercentage === 0.20) return subtotal * 0.20;
        if (selectedTipPercentage === 0.25) return subtotal * 0.25;
        if (customTipAmount) return parseFloat(customTipAmount);
        return 0;
      };
    
      // Update prices whenever cart or delivery method changes
      useEffect(() => {
        const subtotal = cartItems.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        const serviceFee = subtotal * 0.2;
        const deliveryFee = formData.deliveryMethod === 'homeDelivery' ? 4.99 : 0;
        const salesTax = subtotal * 0.1025;      // 10.25% standard sales tax
        const restaurantTax = subtotal * 0.005;   // 0.5% Chicago restaurant tax
        const tip = calculateTipAmount(subtotal);
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

        // Update formData with new tip amount
        setFormData(prev => ({
            ...prev,
            tip: tip
        }));
      }, [cartItems, formData.deliveryMethod, selectedTipPercentage, customTipAmount]);
    
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
        setSubmitAttempted(false);
      };
    
      const handleTipChange = (e) => {
        const { value, id } = e.target;
        const subtotal = pricing.subtotal;
        let tipAmount = 0;
    
        // Handle percentage-based tips
        if (id === 'tip1') {
            setSelectedTipPercentage(0.15);
            setCustomTipAmount('');
        } else if (id === 'tip2') {
            setSelectedTipPercentage(0.20);
            setCustomTipAmount('');
        } else if (id === 'tip3') {
            setSelectedTipPercentage(0.25);
            setCustomTipAmount('');
        } else if (id === 'tip4') {
            setSelectedTipPercentage(0);
            setCustomTipAmount('');
        } else if (id === 'customTip') {
            setSelectedTipPercentage(0);
            setCustomTipAmount(value === '' ? '' : value);
        }
    };
    
      const validateEmail = (email) => {
        return email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      };

      const validateForm = () => {
        const isHomeDelivery = formData.deliveryMethod === 'homeDelivery';
        
        return (
            formData.fullName.trim() !== '' &&
            validateEmail(formData.emailAddress) &&
            formData.cardNumber.trim() !== '' &&
            formData.expiryDate.trim() !== '' &&
            formData.cvv.trim() !== '' &&
            formData.deliveryMethod &&
            (!isHomeDelivery || (
                formData.address.trim() !== '' && 
                formData.zip.trim() !== ''
            )) &&
            formData.terms === true
        );
      };
    
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitAttempted(true);

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);
        
        // Store cart items before clearing
        const orderItems = [...cartItems];
        
        // Add 5 second delay
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Navigate first with cart items
        navigate('/cart/success', { 
            state: { 
                orderData: formData,
                pricing: pricing,
                orderItems: orderItems // Add ordered items to state
            }
        });
        
        // Clear cart after navigation
        clearCart();
      };

      const showError = submitAttempted && !validateForm();
    
    return (
      <div className='app'>
        <div className='main-content'>
        <form className='basket-container' onSubmit={handleSubmit} noValidate>
          <div className='form-container'>
            <label>Your Details</label>
            <input 
            id='fullName' 
            type='text' 
            placeholder='Full Name' 
            className={showError && !formData.fullName.trim() ? 'form-error' : ''}
            value={formData.fullName}
            onChange={handleInputChange}
            required 
            />
            <input 
            id='emailAddress' 
            type='email' 
            placeholder='Email Address' 
            className={showError && !validateEmail(formData.emailAddress) ? 'form-error' : ''}
            value={formData.emailAddress}
            onChange={handleInputChange}
            required 
            />
            <label>Billing</label>
            <input 
                id='cardNumber' 
                type='text' 
                placeholder='Card Number' 
                className={showError && !formData.cardNumber.trim() ? 'form-error' : ''}
                value={formData.cardNumber}
                onChange={handleInputChange}
                required 
            />
            <input 
                id='expiryDate' 
                type='text' 
                placeholder='MM/YY' 
                className={showError && !formData.expiryDate.trim() ? 'form-error' : ''}
                value={formData.expiryDate}
                onChange={handleInputChange}
                required 
            />
            <input 
                id='cvv' 
                type='text' 
                placeholder='CVV' 
                className={showError && !formData.cvv.trim() ? 'form-error' : ''}
                value={formData.cvv}
                onChange={handleInputChange}
                required 
            />
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
            <div className={`delivery-option-content ${showError && !formData.deliveryMethod ? 'btn-error' : ''}`}>
                <FontAwesomeIcon icon={faStore} className="delivery-icon" />
                <p className="delivery-label"><b>Store Pickup</b></p>
                <p className="delivery-price"><b>$0.00</b></p>
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
            <div className={`delivery-option-content ${showError && !formData.deliveryMethod ? 'btn-error' : ''}`}>
                <FontAwesomeIcon icon={faMotorcycle} className="delivery-icon" />
                <p className="delivery-label"><b>Home Delivery</b></p>
                <p className="delivery-price"><b>$4.99</b></p>
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
              <input 
                id='address' 
                type='text' 
                placeholder='Address' 
                className={showError && !formData.address.trim() ? 'form-error' : ''}
                value={formData.address}
                onChange={handleInputChange}
                required 
              />
              <p className='prefilled'>{formData.city}</p>
              <p className='prefilled'>{formData.state}</p>
              <input 
                id='zip' 
                type='text' 
                placeholder='Zip Code' 
                className={showError && !formData.zip.trim() ? 'form-error' : ''}
                value={formData.zip}
                onChange={handleInputChange}
                required 
              />
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
                <div className='cart-item-details-left'>
                    <p><b>{item.name}</b></p> 
                    <p>Quantity: {item.quantity}</p>
                </div>
                <div className='cart-item-details-right'>
                    <p><b>${item.price.toFixed(2)}</b></p>
                    <div className='cart-quantity-control'>
                    <FontAwesomeIcon 
                    icon={faMinus}
                    className='icon decrease'
                    onClick={(e) => {
                    e.stopPropagation();
                    if (item.quantity > 1) {
                      updateQuantity(item.name, item.quantity - 1);
                    } else {
                      removeFromCart(item.name);
                    }
                    }}
                    />
                    <FontAwesomeIcon 
                        icon={faPlus}
                        className='icon increase'
                        onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.name, item.quantity + 1);
                        }}
                    />
                    <FontAwesomeIcon 
                        icon={faXmark} 
                        className='icon remove'
                        onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.name);
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                      />
                    </div>
                    </div>
                    </div>
                    </li>
                  ))}
                  </ul>
                  <span></span>
                  <div>
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
                  <label>Add a Tip?</label>
                  <div className='tip-container'>
                    <div>
                      <div 
                        className={`tip-option ${selectedTipPercentage === 0.15 ? 'active' : ''}`}
                        onClick={() => handleTipChange({ target: { id: 'tip1' } })}
                      >
                        <input 
                          type='radio' 
                          id='tip1' 
                          name='tip' 
                          checked={selectedTipPercentage === 0.15}
                          readOnly
                        />
                        <label><b>15%</b></label>
                        <label>${(pricing.subtotal * 0.15).toFixed(2)}</label>
                      </div>

                      <div 
                        className={`tip-option ${selectedTipPercentage === 0.20 ? 'active' : ''}`}
                        onClick={() => handleTipChange({ target: { id: 'tip2' } })}
                      >
                        <input 
                          type='radio' 
                          id='tip2' 
                          name='tip' 
                          checked={selectedTipPercentage === 0.20}
                          readOnly
                        />
                        <label><b>20%</b></label>
                        <label>${(pricing.subtotal * 0.20).toFixed(2)}</label>
                      </div>

                      <div 
                        className={`tip-option ${selectedTipPercentage === 0.25 ? 'active' : ''}`}
                        onClick={() => handleTipChange({ target: { id: 'tip3' } })}
                      >
                        <input 
                          type='radio' 
                          id='tip3' 
                          name='tip' 
                          checked={selectedTipPercentage === 0.25}
                          readOnly
                        />
                        <label><b>25%</b></label>
                        <label>${(pricing.subtotal * 0.25).toFixed(2)}</label>
                      </div>
                    </div>
                    <div className='custom-tip-input'>
                      <input
                        type='number' 
                        id='customTip' 
                        placeholder='Custom Tip: $0.00'
                        onChange={handleTipChange}
                        value={customTipAmount}
                        min="0"
                        step="0.01"
                        aria-label="Custom tip amount"
                      />
                    </div>

                    <div 
                      className={`tip-option ${selectedTipPercentage === 0 ? 'active' : ''}`}
                      onClick={() => handleTipChange({ target: { id: 'tip4' } })}
                    >
                      <input 
                        type='radio' 
                        id='tip4' 
                        name='tip' 
                        checked={selectedTipPercentage === 0}
                        readOnly
                      />
                      <label><b>No Tip</b></label>
                    </div>
                  </div>
                  <div className={`checkbox-container ${showError && !formData.terms ? 'form-error' : ''}`}>
                    <label 
                      htmlFor='terms' 
                      style={{ color: showError && !formData.terms ? 'darkred' : 'inherit' }}
                    >
                      I agree to the <Link to='' style={{ color: showError && !formData.terms ? 'darkred' : 'inherit' }}>Terms and Conditions</Link>
                    </label>
                    <input 
                      type='checkbox' 
                      id='terms' 
                      checked={formData.terms}
                      onChange={(e) => {
                        setFormData(prev => ({
                            ...prev,
                            terms: e.target.checked
                        }));
                        setSubmitAttempted(false);
                    }}
                    required 
                />
            </div>
            <div className='horizontal-container'>
                <button 
                    type='submit' 
                    className={`btn-unavail ${validateForm() ? 'btn-form-active' : ''}`}
                    disabled={isProcessing}
                >
                    <b>{isProcessing ? 'Processing...' : 'Place Order'}</b>
                </button>
                <Link to="/menu"><div className='btn'><b>Add More Items</b></div></Link>
            </div>
          </div> 
        </form>
        </div>
      </div>
    );
};

export default Cart;