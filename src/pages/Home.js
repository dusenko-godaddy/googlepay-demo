import React from 'react';

import { Link } from "react-router-dom";

import ProductItem from '../components/ProductItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { products } from '../common/data';

import './Home.css';

const Home = ({cart, addToCart, addDetailsItem}) => {
  return (
    <div className="page">
      <Link to="/cart" className="cart">
        <FontAwesomeIcon className="fa-lg" icon={faShoppingCart} />
        <span className="cart-basket d-flex align-items-center justify-content-center">
          {cart.length}
        </span>
      </Link>
      <div className="main">
        {products.map(product => {
          return <ProductItem product={product} key={product.id} addToCart={addToCart} addDetailsItem={addDetailsItem} />
        })}
      </div>
      <p id="collect"></p>
    </div>
  );
}

export default Home;