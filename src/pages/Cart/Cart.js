import { useCart } from "react-use-cart";
import { useState, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Loading from '../../components/Loading/Loading';
import PoyntCollect from '../../components/PoyntCollect/PoyntCollect';
import ProductsTable from '../../components/ProductsTable/ProductsTable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { items, cartTotal, totalItems, isEmpty, emptyCart } = useCart();

  const onNonce = useCallback((nonce) => {
    emptyCart();
    console.log("NONCE RECEIVED", nonce);
    navigate("/success-page");
  }, [navigate, emptyCart]);

  const options = {
    requireEmail: true,
    requirePhone: true,
    requireShippingAddress: true,
    paymentMethods: {
      googlePay: true,
      applePay: true
    }
  };

  return (
    <div className="page">
      <Loading loading={loading}/>
      <Link to="/cart" className="cart">
        <FontAwesomeIcon className="fa-lg" icon={faShoppingCart} />
        <span className="cart-basket d-flex align-items-center justify-content-center">
          {totalItems}
        </span>
      </Link>
      {!isEmpty ? (
        <div className={loading ? 'disabled' : 'active'}>
          <ProductsTable/>
          <div className="cart_payment">
            <div className="cart_payment_checkout">
              <Link to="/checkout" className="checkout">
                <button type="button" className="cart_payment_checkout_button">Go to checkout</button>
              </Link>
            </div>
            <PoyntCollect
              cartItems={items}
              cartTotal={cartTotal}
              setLoading={setLoading}
              options={options}
              collectId="collect"
              onNonce={onNonce}
            />
          </div>
        </div>
      ) : (
        <div className={loading ? "disabled" : "centered"}>
          <p>No items here:(</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
