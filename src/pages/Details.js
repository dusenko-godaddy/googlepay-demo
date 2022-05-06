import React, { useMemo } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import PoyntCollect from '../components/PoyntCollect';

import ClipLoader from "react-spinners/ClipLoader";

import './Details.css';

const Details = ({product}) => {
  const [loading, setLoading] = useState(product ? true : false);
  const navigate = useNavigate();

  const collectItems = useMemo(() => {
    return [product];
  }, [product]);

  const onNonce = useCallback((nonce) => {
    console.log("NONCE RECEIVED", nonce);
    navigate("/success-page");
  }, [navigate]);

  const options = {
    requireEmail: true,
    requirePhone: true,
    supportCouponCode: true,
    paymentMethods: {
      googlePay: true,
      applePay: true
    }
  };

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  return (
    <div className="details">
      <div id={loading ? "center" : "none"}>
        <ClipLoader className="loader" loading={loading} size={150} />
      </div>
      <div className={loading ? 'disabled product product-details' : 'active product product-details'}>
        <div className="product_left">
          <img width="200" height="200" src={product.src} alt={product.name} />
        </div>
        <div className="product_right">
          <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>
          <div className="product_actions">
            <p className="product_price">{product.price}$</p>
            <PoyntCollect 
              cartItems={collectItems}
              setLoading={setLoading}
              options={options}
              collectId="collect"
              onNonce={onNonce}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details;
