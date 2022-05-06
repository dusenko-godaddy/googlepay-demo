import React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Link } from "react-router-dom";

import PoyntCollect from '../components/PoyntCollect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

import './Checkout.css';

const Checkout = ({cart}) => {
  const [loading, setLoading] = useState(cart.length ? true : false);
  const navigate = useNavigate();

  const options = {
    requireEmail: true,
    requirePhone: true,
    requireShippingAddress: true,
    supportCouponCode: true,
    paymentMethods: {
      card: true,
      googlePay: true,
      applePay: true
    }
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
        <div className="collect_wrapper">
          <PoyntCollect 
            setLoading={setLoading}
            cartItems={cart}
            options={options}
            collectId="collect_wallet"
            onNonce={onNonce}
          />
        </div>
      ) : (
        <div id={loading ? "none" : "center"}>
          <p>No items in the cart:(</p>
        </div>
      )}

    </div>
  );
}

export default Checkout;
