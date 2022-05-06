import React from 'react';

import { useNavigate } from "react-router-dom";

import './ProductItem.css';

const ProductItem = ({product, addToCart, addDetailsItem}) => {
  const navigate = useNavigate();

  const handler = () => {
    addDetailsItem(product);
    navigate("/details");
  }

  return (
    <div className="product">
      <div className="product_left">
        <img width="200" height="200" src={product.src} alt={product.name} />
      </div>
      <div className="product_right">
        <div>
          <h2 onClick={handler}>{product.name}</h2>
          <p>{product.description}</p>
        </div>
        <div className="product_actions">
          <p className="product_price">{product.price}$</p>
          <button className="product_button" onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  )
};

export default ProductItem;
