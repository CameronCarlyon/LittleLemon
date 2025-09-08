import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import HeroButton from './HeroButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faStore, faXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

/**
 * Cart component - handles checkout form, order summary, and payment processing
 * 
 * Features:
 * - Form validation with real-time feedback
 * - Dynamic pricing calculations
 * - Tip selection with custom amounts
 * - Delivery method selection
 * - Accessible form controls
 * 
 * @component
 */
const Cart = () => {
  // Form state management
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
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cart state from context
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Pricing state
  const [pricing, setPricing] = useState({
    subtotal: 0,
    serviceFee: 0,
    deliveryFee: 0,
    salesTax: 0,
    restaurantTax: 0,
    tip: 0,
    total: 0
  });

  // Tip selection state
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [selectedTipPercentage, setSelectedTipPercentage] = useState(0);

  const navigate = useNavigate();

  /**
   * Calculate tip amount based on selected percentage or custom amount
   * @param {number} subtotal - Order subtotal
   * @returns {number} Calculated tip amount
   */
  const calculateTipAmount = useCallback((subtotal) => {
    if (selectedTipPercentage === 0.15) return subtotal * 0.15;
    if (selectedTipPercentage === 0.20) return subtotal * 0.20;
    if (selectedTipPercentage === 0.25) return subtotal * 0.25;
    if (customTipAmount) return parseFloat(customTipAmount) || 0;
    return 0;
  }, [selectedTipPercentage, customTipAmount]);

  /**
   * Validate email address format
   * @param {string} email - Email to validate
   * @returns {boolean} Validation result
   */
  const validateEmail = useCallback((email) => {
    if (!email?.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, []);

  /**
   * Comprehensive form validation
   * @returns {boolean} Form validity
   */
  const validateForm = useCallback(() => {
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
  }, [formData, validateEmail]);


  /**
   * Individual field validation for better error handling
   * @param {string} fieldName - Name of field to validate
   * @returns {boolean} Field validity
   */
  const validateField = useCallback((fieldName) => {
    const isHomeDelivery = formData.deliveryMethod === 'homeDelivery';
    
    switch (fieldName) {
      case 'fullName':
        return formData.fullName.trim() !== '';
      case 'emailAddress':
        return validateEmail(formData.emailAddress);
      case 'cardNumber':
        return formData.cardNumber.trim() !== '';
      case 'expiryDate':
        return formData.expiryDate.trim() !== '';
      case 'cvv':
        return formData.cvv.trim() !== '';
      case 'deliveryMethod':
        return !!formData.deliveryMethod;
      case 'address':
        return !isHomeDelivery || formData.address.trim() !== '';
      case 'zip':
        return !isHomeDelivery || formData.zip.trim() !== '';
      case 'terms':
        return formData.terms === true;
      default:
        return true;
    }
  }, [formData, validateEmail]);

  /**
   * Check if field should show error state
   * @param {string} fieldName - Name of field to check
   * @returns {boolean} Should show error
   */
  const shouldShowFieldError = useCallback((fieldName) => {
    return submitAttempted && !validateField(fieldName);
  }, [submitAttempted, validateField]);

  /**
   * Update pricing calculations when dependencies change
   */
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
  }, [cartItems, formData.deliveryMethod, calculateTipAmount]);

  /**
   * Handle delivery method selection
   * @param {string} method - Selected delivery method
   */
  const handleDeliveryChange = useCallback((method) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: method,
    }));
    
    // Clear delivery method error when selection is made
    if (errors.deliveryMethod) {
      setErrors(prev => ({
        ...prev,
        deliveryMethod: null
      }));
    }
  }, [errors.deliveryMethod]);

  /**
   * Handle standard form input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setSubmitAttempted(false);
  }, []);

  /**
   * Handle tip selection and custom tip input
   * @param {Event} e - Input change event
   */
  const handleTipChange = useCallback((e) => {
    const { value, id } = e.target;
    
    if (id === 'customTip') {
      // When entering a custom tip, clear percentage selection
      setSelectedTipPercentage(null);
      setCustomTipAmount(value === '' ? '' : value);
    } else {
      // When selecting a percentage, clear custom tip
      const tipPercentages = {
        'tip1': 0.15,
        'tip2': 0.20,
        'tip3': 0.25,
        'tip4': 0
      };
      
      setSelectedTipPercentage(tipPercentages[id] || 0);
      setCustomTipAmount('');
    }
  }, []);


  /**
   * Handle form submission - validate, process payment, and navigate
   * @param {Event} e - Submit event
   */
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
            orderItems: orderItems
        }
    });
    
    // Clear cart after navigation
    clearCart();
  };


  return (
    <div className='app'>
      <div className='main-content' id='main-content'>
      <h1 className='cart-header'>Cart</h1>
      <form className='basket-container' onSubmit={handleSubmit} noValidate>
        <div className='form-container'>
          <label>Your Details</label>
          <input 
          id='fullName' 
          type='text' 
          placeholder='Full Name' 
          className={shouldShowFieldError('fullName') ? 'form-error' : ''}
          value={formData.fullName}
          onChange={handleInputChange}
          required 
          />
          <input 
          id='emailAddress' 
          type='email' 
          placeholder='Email Address' 
          className={shouldShowFieldError('emailAddress') ? 'form-error' : ''}
          value={formData.emailAddress}
          onChange={handleInputChange}
          required 
          />
          <label>Billing</label>
          <input 
              id='cardNumber' 
              type='text' 
              placeholder='Card Number' 
              className={shouldShowFieldError('cardNumber') ? 'form-error' : ''}
              value={formData.cardNumber}
              onChange={handleInputChange}
              required 
          />
          <input 
              id='expiryDate' 
              type='text' 
              placeholder='MM/YY' 
              className={shouldShowFieldError('expiryDate') ? 'form-error' : ''}
              value={formData.expiryDate}
              onChange={handleInputChange}
              required 
          />
          <input 
              id='cvv' 
              type='text' 
              placeholder='CVV' 
              className={shouldShowFieldError('cvv') ? 'form-error' : ''}
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
        <div className={`delivery-option-content ${shouldShowFieldError('deliveryMethod') ? 'btn-error' : ''}`}>
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
        <div className={`delivery-option-content ${shouldShowFieldError('deliveryMethod') ? 'btn-error' : ''}`}>
            <FontAwesomeIcon icon={faMotorcycle} className="delivery-icon" />
            <p><b>Home Delivery</b></p>
            <p><b>$4.99</b></p>
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
              className={shouldShowFieldError('address') ? 'form-error' : ''}
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
              className={shouldShowFieldError('zip') ? 'form-error' : ''}
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
                      step="0.1"
                      aria-label="Custom tip amount"
                      className={customTipAmount ? 'active' : ''}
                    />
                  </div>

                  <div 
                    className={`tip-option ${selectedTipPercentage === 0 && !customTipAmount ? 'active' : ''}`}
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
                <div className={`checkbox-container ${shouldShowFieldError('terms') ? 'form-error' : ''}`}>
                  <label 
                    htmlFor='terms' 
                    style={{ color: shouldShowFieldError('terms') ? 'darkred' : 'inherit' }}
                  >
                    I agree to the <Link to='' style={{ color: shouldShowFieldError('terms') ? 'darkred' : 'inherit' }}>Terms and Conditions</Link>
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
            <HeroButton
                  type='submit'
                  variant={validateForm() ? 'tertiary' : 'disabled'}
                  disabled={!validateForm() || isProcessing}
                  aria-disabled={!validateForm() || isProcessing}
                  aria-busy={isProcessing}
              >
                  <b>{isProcessing ? 'Processing...' : 'Place Order'}</b>
                  </HeroButton>
              <Link to="/menu">
                <div className='btn'>
                  <b>Add More Items</b>
                </div>
              </Link>
          </div>
        </div> 
      </form>
      </div>
    </div>
  );
};

export default Cart;