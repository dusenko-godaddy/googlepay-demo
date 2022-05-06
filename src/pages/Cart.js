import React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Link } from "react-router-dom";

import PoyntCollect from '../components/PoyntCollect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from "react-router-dom";

import ClipLoader from "react-spinners/ClipLoader";

import './Cart.css';

const Cart = ({cart, removeFromCart}) => {
  const [loading, setLoading] = useState(cart.length ? true : false);
  const navigate = useNavigate();

  const cartMap = {};
  let total = 0;

  const removeItemsFromCart = (value) => {
    setLoading(true);
    removeFromCart(value);
  };

  useEffect(() => {
    if (!cart.length) {
      setLoading(false);
    }
  }, [cart]);

  const onNonce = useCallback((nonce) => {
    console.log("NONCE RECEIVED", nonce);
    navigate("/success-page");
  }, [navigate]);

  const options = {
    requireEmail: true,
    requirePhone: true,
    requireShippingAddress: true,
    paymentMethods: {
      googlePay: true,
      applePay: true
    }
  };

  cart.forEach(product => {
    if (!cartMap[product.id]) {
      cartMap[product.id] = {
        value: product,
        count: 1,
      };
    } else {
      cartMap[product.id].count = cartMap[product.id].count + 1;
    }

    total += product.price;
  });

  return (
    <div className="page">
      <div id={loading ? "center" : "none"}>
        <ClipLoader className="loader" loading={loading} size={150} />
      </div>
      <Link to="/cart" className="cart">
        <FontAwesomeIcon className="fa-lg" icon={faShoppingCart} />
        <span className="cart-basket d-flex align-items-center justify-content-center">
          {cart.length}
        </span>
      </Link>
      {cart.length ? (
        <div className={loading ? 'disabled' : 'active'}>
          <table>
            <thead>
              <tr className="cart_headers">
                <th className="left">Name</th>
                <th className="left">Description</th>
                <th className="center">Price</th>
                <th className="center">Count</th>
                <th className="center bold">Total price</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody className="cart_items">
              {Object.keys(cartMap).map(item => {
                return (
                  <tr className="cart_item" key={item}>
                    <td className="left">{cartMap[item].value.name}</td>
                    <td className="left">{cartMap[item].value.description}</td>
                    <td className="center">{cartMap[item].value.price}$</td>
                    <td className="center">{cartMap[item].count}</td>
                    <td className="center bold">{cartMap[item].count * cartMap[item].value.price}$</td>
                    <td className="right action">
                      <FontAwesomeIcon 
                        onClick={() => removeItemsFromCart(cartMap[item].value)} 
                        className="fa-lg" 
                        icon={faTimes} 
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="cart_total">Total: <span>{total}$</span></p>
          <div className="cart_payment">
            <div className="cart_payment_checkout">
              <Link to="/checkout" className="checkout">
                <button type="button" className="cart_payment_checkout_button">Go to checkout</button>
              </Link>
            </div>
            <PoyntCollect 
              setLoading={setLoading}
              cartItems={cart}
              options={options}
              collectId="collect"
              onNonce={onNonce}
            />
          </div>
        </div>
      ) : (
        <div id={loading ? "none" : "center"}>
          <p>No items here:(</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
