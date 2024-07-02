import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from 'react';

import Loading from "../../components/Loading/Loading";
import CartIcon from '../../components/CartIcon/CartIcon';
import PoyntCollect from '../../components/PoyntCollect/PoyntCollect';

import { products } from '../../lib/common/data';

import './ApplePayTest2.css';

const Details = () => {
  const navigate = useNavigate();
  const { totalItems, emptyCart } = useCart();

  const collectProducts = useMemo(() => {
    return [products.find(item => item.id === Number(2))];
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
      businessId: "33eb2e79-d186-44b8-badb-7e62e6651344",
      applicationId: "urn:aid:4c0e5603-1ef1-4d30-911e-fb9fca592f0c",
      merchantName: "ApplePay Test 2",
      country: "CA",
      currency: "CAD",
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
