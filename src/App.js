import React from 'react';
import { useState } from 'react';

import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Home from './pages/Home';
import Cart from './pages/Cart';
import Details from './pages/Details';
import Checkout from './pages/Checkout';
import SuccessPage from './pages/SuccessPage';

import './App.css';

import TokenizeJs from './dist/bundle';

function App() {
  const [cart, setCart] = useState([]);
  const [detailsItem, setDetailsItem] = useState(null);

  const addToCart = (item) => {
    setCart((state) => {
      return [...state, item];
    });
  };

  const addDetailsItem = (item) => {
    setDetailsItem(item);
  }

  const removeFromCart = (item) => {
    setCart((cart) => {
      return cart.filter(cartitem => cartitem.id !== item.id);
    });
  }

  return (
    <Router>
      <Link to="/" className="header">
        <h1>GD Happy Merchant</h1>
      </Link>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home cart={cart} addToCart={addToCart} addDetailsItem={addDetailsItem} />} />
          <Route path="/details" element={<Details product={detailsItem} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} /> } />
          <Route path="/checkout" element={<Checkout cart={cart} /> } />
          <Route path="/success-page" element={<SuccessPage /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
