import { useCart } from "react-use-cart";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/Loading/Loading";
import CartIcon from "../../components/CartIcon/CartIcon";
import PoyntCollect from "../../components/PoyntCollect/PoyntCollect";
import ProductsTable from "../../components/ProductsTable/ProductsTable";

import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, totalItems, isEmpty, emptyCart } = useCart();
  const [loading, setLoading] = useState(isEmpty ? false : true);

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
  }, [navigate]);

  const options = useMemo(() => {
    return {
      requireEmail: true,
      requirePhone: true,
      requireShippingAddress: true,
      supportCouponCode: true,
      paymentMethods: {
        card: true,
        googlePay: true,
        applePay: true,
        paze: true,
      },
    };
  }, []);

  return (
    <div className="page">
      <Loading loading={loading}/>
      <CartIcon totalItems={totalItems}/>
      {!isEmpty ? (
        <div className={loading ? "disabled" : "active"}>
          <ProductsTable/>
          <div className="collect_wrapper">
            <PoyntCollect
              cartItems={items}
              cartTotal={cartTotal}
              setLoading={setLoading}
              options={options}
              collectId="collect_wallet"
              onNonce={onNonce}
            />
          </div>
        </div>
      ) : (
        <div className={loading ? "disabled" : "active"}>
          <p>No items in the cart:(</p>
        </div>
      )}

    </div>
  );
}

export default Checkout;
