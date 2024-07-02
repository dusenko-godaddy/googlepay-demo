import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from 'react';

import Loading from "../../components/Loading/Loading";
import CartIcon from '../../components/CartIcon/CartIcon';
import PoyntCollect from '../../components/PoyntCollect/PoyntCollect';

import { products } from '../../lib/common/data';

import './ApplePayTest1.css';

const Details = () => {
  const navigate = useNavigate();
  const { totalItems, emptyCart } = useCart();

  const collectProducts = useMemo(() => {
    return [products.find(item => item.id === Number(1))];
  }, []);

  const product = collectProducts[0];
  const [loading, setLoading] = useState(product ? true : false);

  const onNonce = useCallback(async (data, request) => {
    try {
      console.log("NONCE DATA RECEIVED", data);

      if (!window.chargeEndpoint) {
        emptyCart();
        return navigate("/success-page");
      }

      console.log('charging...');
  
      const response = await fetch(window.chargeEndpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          amount: Number(request.total.amount) * 100,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      console.log('SUCCESSFUL CHARGE', result);
      
      emptyCart();
      navigate("/success-page");
    } catch(error) {
      throw error;
    }
  }, [navigate, emptyCart]);

  const options = useMemo(() => {
    return {
      businessId: "afabc7eb-8864-47aa-ad8a-83e734940ebb",
      applicationId: "urn:aid:5ddfcd36-65d5-4802-9866-a65516914512",
      merchantName: "ApplePay Test 1",
      country: "US",
      currency: "USD",
      requireEmail: true,
      requirePhone: true,
      supportCouponCode: true,
      paymentMethods: {
        googlePay: false,
        applePay: true,
        paze: false,
      },
    };
  }, []);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  return (
    <div className="page">
      <Loading loading={loading}/>
      <CartIcon totalItems={totalItems}/>
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
              cartItems={collectProducts}
              cartTotal={product.price}
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
