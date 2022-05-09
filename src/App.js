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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCFkJA6Jkm2jFlTCpxyhIZRVar07psnJw",
  authDomain: "pay-demo-9577e.firebaseapp.com",
  projectId: "pay-demo-9577e",
  storageBucket: "pay-demo-9577e.appspot.com",
  messagingSenderId: "978835034008",
  appId: "1:978835034008:web:83f6245e992c0cc846e5ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
