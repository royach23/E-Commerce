import React, { createContext, useReducer, useContext } from 'react';
import { CartItem, CartState } from '../types/Cart';

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { id: number; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; size: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState;
  switch (action.type) {
    case 'ADD_TO_CART':
      { const existingItemIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id && item.size === action.payload.size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };

        newState = {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price * action.payload.quantity
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload }],
          total: state.total + action.payload.price * action.payload.quantity
        };
      }
      localStorage.setItem('cartState', JSON.stringify(newState));
      return newState; }

    case 'REMOVE_FROM_CART':
      { const itemToRemove = state.items.find(
        item => item.product_id === action.payload.id && item.size === action.payload.size
      );

      newState = {
        ...state,
        items: state.items.filter(
          item => !(item.product_id === action.payload.id && item.size === action.payload.size)
        ),
        total: state.total - (itemToRemove?.price || 0) * (itemToRemove?.quantity || 0)
      };
      localStorage.setItem('cartState', JSON.stringify(newState));
      return newState; }

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.product_id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((total, item) => 
          item.product_id === action.payload.id && item.size === action.payload.size
            ? total + item.price * action.payload.quantity
            : total + item.price * item.quantity
        , 0)
      };
      localStorage.setItem('cartState', JSON.stringify(newState));
      return newState;

    case 'CLEAR_CART':
      localStorage.removeItem('cartState');
      return initialState;

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
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    const savedCart = localStorage.getItem('cartState');
    return savedCart ? JSON.parse(savedCart) : initial;
  });

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