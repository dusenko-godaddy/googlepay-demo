import { useCart } from "react-use-cart";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from 'react';

import Loading from "../../components/Loading/Loading";
import CartIcon from '../../components/CartIcon/CartIcon';
import PoyntCollect from '../../components/PoyntCollect/PoyntCollect';

import { products } from '../../lib/common/data';

import './Details.css';

const Details = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { totalItems, emptyCart } = useCart();

  const collectProducts = useMemo(() => {
    return [products.find(item => item.id === Number(params.id))];
  }, [params.id]);

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
      requireEmail: true,
      requirePhone: true,
      supportCouponCode: true,
      paymentMethods: {
        googlePay: true,
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
