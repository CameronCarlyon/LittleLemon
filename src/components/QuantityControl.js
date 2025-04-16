import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const QuantityControl = ({ quantity = 0, onIncrease, onDecrease, minQuantity = 0 }) => {
    const renderButton = () => (
        <button 
            onClick={onIncrease}
            className="add-to-cart-btn"
            aria-label="Add to cart"
        >
            Add to Cart
        </button>
    );

    const renderControls = () => (
        <>
            <button 
                onClick={onDecrease}
                disabled={quantity <= minQuantity}
                aria-label="Decrease quantity"
                className="quantity-btn"
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>
            <div className="quantity-display">{quantity}</div>
            <button 
                onClick={onIncrease}
                aria-label="Increase quantity"
                className="quantity-btn"
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </>
    );

    return (
        <div className="quantity-control" data-active={quantity > 0}>
            {quantity === 0 ? renderButton() : renderControls()}
        </div>
    );
};

QuantityControl.displayName = 'QuantityControl';

export default QuantityControl;