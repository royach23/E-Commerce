import React, { createContext, useReducer, useContext } from 'react';
import { CartItem, CartState } from '../types/Cart';

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } };

const initialState: CartState = {
  items: [],
  total: 0
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      { const existingItemIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };

        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price 
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload }],
        total: state.total + action.payload.price *  action.payload.quantity
      }; }

    case 'REMOVE_FROM_CART':
      { const itemToRemove = state.items.find(
        item => item.product_id === action.payload
      );

      return {
        ...state,
        items: state.items.filter(item => item.product_id !== action.payload),
        total: state.total - (itemToRemove?.price || 0) * (itemToRemove?.quantity || 0)
      }; }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product_id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((total, item) => 
          item.product_id === action.payload.id
            ? total + item.price * action.payload.quantity
            : total + item.price * item.quantity
        , 0)
      };

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};