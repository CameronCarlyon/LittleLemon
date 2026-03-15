import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
const MAX_TOTAL_CART_QUANTITY = 99;

const getTotalCartQuantity = (items) =>
    items.reduce((total, item) => total + item.quantity, 0);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item, quantity = 1) => {
        setCartItems(currentItems => {
            const existingItem = currentItems.find(i => i.name === item.name);
            const totalQuantity = getTotalCartQuantity(currentItems);
            const availableSpace = Math.max(0, MAX_TOTAL_CART_QUANTITY - totalQuantity);
            const requestedQuantity = Math.max(0, quantity);
            const allowedQuantity = Math.min(requestedQuantity, availableSpace);

            if (allowedQuantity === 0) {
                return currentItems;
            }
            
            if (existingItem) {
                return currentItems.map(i =>
                    i.name === item.name 
                        ? { ...i, quantity: i.quantity + allowedQuantity }
                        : i
                );
            }
            
            return [...currentItems, { ...item, quantity: allowedQuantity }];
        });
    };

    const removeFromCart = (itemName) => {
        setCartItems(currentItems => 
            currentItems.filter(item => item.name !== itemName)
        );
    };

    const updateQuantity = (itemName, newQuantity) => {
        setCartItems(currentItems => {
            const targetItem = currentItems.find(item => item.name === itemName);

            if (!targetItem) {
                return currentItems;
            }

            const safeRequestedQuantity = Math.max(0, newQuantity);

            if (safeRequestedQuantity === 0) {
                return currentItems.filter(item => item.name !== itemName);
            }

            const otherItemsTotal = currentItems
                .filter(item => item.name !== itemName)
                .reduce((total, item) => total + item.quantity, 0);
            const maxAllowedForItem = Math.max(0, MAX_TOTAL_CART_QUANTITY - otherItemsTotal);
            const clampedQuantity = Math.min(safeRequestedQuantity, maxAllowedForItem);

            return currentItems.map(item =>
                item.name === itemName
                    ? { ...item, quantity: clampedQuantity }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}