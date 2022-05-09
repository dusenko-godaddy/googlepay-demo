import React from 'react';
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";

import './ProductItem.css';

const ProductItem = ({product}) => {
  const { addItem } = useCart();

  return (
    <div className="product">
      <div className="product_left">
        <img width="200" height="200" src={product.src} alt={product.name} />
      </div>
      <div className="product_right">
        <div>
          <Link to={"/details/" + product.id} className="details">
            <h2>{product.name}</h2>
          </Link>
          <p>{product.description}</p>
        </div>
        <div className="product_actions">
          <p className="product_price">{product.price}$</p>
          <button className="product_button" onClick={() => addItem(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  )
};

export default ProductItem;
