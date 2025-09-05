import React, { memo, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';

/**
 * QuantityControl - A clean, animated cart quantity control with GSAP animations
 * 
 * @param {Object} props - Component props
 * @param {number} props.quantity - Current quantity (default: 0)
 * @param {Function} props.onIncrease - Handler for quantity increase
 * @param {Function} props.onDecrease - Handler for quantity decrease
 * @param {number} props.maxQuantity - Maximum allowed quantity (default: 99)
 */
const QuantityControl = memo(({ 
  quantity = 0, 
  onIncrease, 
  onDecrease, 
  maxQuantity = 99
}) => {
  const [isActive, setIsActive] = useState(quantity > 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const controlRef = useRef(null);
  const quantityDisplayRef = useRef(null);
  const minusButtonRef = useRef(null);
  const plusButtonRef = useRef(null);
  const prevQuantityRef = useRef(0);
  
// Pulse animation for quantity display
  const pulseQuantityDisplay = () => {
    const element = quantityDisplayRef.current;
    if (!element) return;

    gsap.timeline()
      .to(element, {
        scale: 1.3,
        duration: 0.15,
        ease: 'power2.out'
      })
      .to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.5)'
      });
  };

   // Reverse pulse animation for button press effect

  const createButtonPressAnimation = (buttonElement) => {
    if (!buttonElement) return;
    
    gsap.to(buttonElement, {
      scale: 0.85,
      duration: 0.01,
    });
  };

  /**
   * Release animation for button - returns to normal scale
   * 
   * @param {HTMLElement} buttonElement - The button element to animate
   */
  const createButtonReleaseAnimation = (buttonElement) => {
    if (!buttonElement) return;
    
    gsap.to(buttonElement, {
      scale: 1,
      duration: 0.15,
      ease: 'back.out(1.2)'
    });
  };

  // Initialize GSAP settings for all animated elements
  useEffect(() => {
    const quantityElement = quantityDisplayRef.current;
    const minusElement = minusButtonRef.current;
    const plusElement = plusButtonRef.current;
    
    // Set transform origins for consistent scaling
    if (quantityElement) {
      gsap.set(quantityElement, {
        transformOrigin: 'center center'
      });
    }
    
    if (minusElement) {
      gsap.set(minusElement, {
        transformOrigin: 'center center'
      });
    }
    
    if (plusElement) {
      gsap.set(plusElement, {
        transformOrigin: 'center center'
      });
    }
  }, []);

  // Sync active state with quantity changes and trigger pulse animation
  useEffect(() => {
    const wasActive = isActive;
    const shouldBeActive = quantity > 0;
    
    if (shouldBeActive && !wasActive) {
      setIsActive(true);
    } else if (!shouldBeActive && wasActive) {
      setIsActive(false);
    }

    // Trigger pulse animation when quantity changes (but not on initial render)
    if (wasActive && shouldBeActive && quantity !== prevQuantityRef.current && prevQuantityRef.current > 0) {
      pulseQuantityDisplay();
    }

    prevQuantityRef.current = quantity;
  }, [quantity, isActive]);
  
  // Handle add to cart click - with no delay
  const handleAddToCart = () => {
    if (isAnimating || isActive) return;
    
    setIsActive(true);
    onIncrease();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 50);
  };
  
  // Handle decrease with transition back to inactive state
  const handleDecrease = (e) => {
    e.stopPropagation();
    if (isAnimating) return;
    
    onDecrease();
    
    if (quantity <= 1) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 50);
    }
  };
  
  // Handle increase with max quantity check
  const handleIncrease = (e) => {
    e.stopPropagation();
    if (isAnimating || quantity >= maxQuantity) return;
    
    onIncrease();
  };

  // Button press handlers for animations
  const handleMinusPress = () => createButtonPressAnimation(minusButtonRef.current);
  const handleMinusRelease = () => createButtonReleaseAnimation(minusButtonRef.current);
  const handlePlusPress = () => createButtonPressAnimation(plusButtonRef.current);
  const handlePlusRelease = () => createButtonReleaseAnimation(plusButtonRef.current);
  
  return (
    <div 
      ref={controlRef}
      className={`quantity-control${isActive ? ' active' : ''}`}
      aria-live="polite"
      onClick={handleAddToCart}
      role={!isActive ? "button" : undefined}
      tabIndex={!isActive ? 0 : undefined}
      aria-label={!isActive ? "Add to cart" : undefined}
    >
      {isActive ? (
        <div className="quantity-controls" onClick={(e) => e.stopPropagation()}>
          <div className="quantity-control-inner">
            <button 
              ref={minusButtonRef}
              onClick={handleDecrease}
              onMouseDown={handleMinusPress}
              onMouseUp={handleMinusRelease}
              onMouseLeave={handleMinusRelease}
              onTouchStart={handleMinusPress}
              onTouchEnd={handleMinusRelease}
              aria-label="Decrease quantity"
              className="quantity-btn"
              disabled={isAnimating}
            >
              <FontAwesomeIcon icon={faMinus} size="sm" fixedWidth />
            </button>
            
            <span 
              ref={quantityDisplayRef}
              className="quantity-display" 
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>
            
            <button 
              ref={plusButtonRef}
              onClick={handleIncrease}
              onMouseDown={handlePlusPress}
              onMouseUp={handlePlusRelease}
              onMouseLeave={handlePlusRelease}
              onTouchStart={handlePlusPress}
              onTouchEnd={handlePlusRelease}
              aria-label={quantity >= maxQuantity ? 
                `Maximum quantity reached: ${maxQuantity}` : 
                "Increase quantity"}
              className="quantity-btn"
              disabled={isAnimating || quantity >= maxQuantity}
            >
              <FontAwesomeIcon icon={faPlus} size="sm" fixedWidth />
            </button>
          </div>
        </div>
      ) : (
        <span className="add-to-cart-text">Add to Cart</span>
      )}
    </div>
  );
});

QuantityControl.displayName = 'QuantityControl';

export default QuantityControl;