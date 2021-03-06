import $ from 'jquery';
import { useAlert } from 'react-alert';
import Button from 'react-bootstrap-button-loader';
import { useLayoutEffect, useRef, useState } from 'react';

import './PoyntCollect.css';

import constants from '../../lib/common/constants';
import { availableCouponCodes } from '../../lib/common/data';
import { createOrder, buildLineItems, buildTotal, getShippingMethods } from '../../lib/helpers/wallet';

const PoyntCollect = ({setLoading, options, collectId, onNonce, cartItems, cartTotal, couponCode}) => {
  const alert = useAlert();
  const collect = useRef();
  const [buttonLoading, setButtonLoading] = useState(false);

  const getNonce = () => {
    setButtonLoading(true);
    collect.current.getNonce({});
  };

  useLayoutEffect(() => {
    if (setLoading) {
      setLoading(true);
    }

    const order = createOrder(cartItems, cartTotal, availableCouponCodes[1]);

    console.log("order", order);

    const walletRequest = {
      merchantName: "GoDaddy Merchant",
      country: constants.poyntCollect.country,
      currency: constants.poyntCollect.currency,
      lineItems: buildLineItems(order),
      total: buildTotal(order),
      requireEmail: options.requireEmail,
      requirePhone: options.requirePhone,
      requireShippingAddress: options.requireShippingAddress,
      supportCouponCode: options.supportCouponCode,
      couponCode: order.coupon,
      disableWallets: {
        applePay: !options.paymentMethods?.applePay,
        googlePay: !options.paymentMethods?.googlePay,
      },
    };

    console.log("walletRequest", walletRequest);

    collect.current = new window.TokenizeJs(
      constants.poyntCollect.businessId,
      constants.poyntCollect.applicationId,
      walletRequest
    );

    window.poynt = collect.current;
    
    collect.current.supportWalletPayments().then((result) => {
      if (!collect.current) {
        return;
      }

      const paymentMethods = [];

      if (options.paymentMethods?.card) {
        paymentMethods.push("card");
      }

      if (options.paymentMethods?.applePay && result.applePay) {
        paymentMethods.push("apple_pay");
      } else if (options.paymentMethods?.googlePay && result.googlePay) {
        paymentMethods.push("google_pay");
      }

      if (paymentMethods.length) {
        collect.current.mount(collectId, document, {
          amount: 2000,
          paymentMethods: paymentMethods,
          iFrame: constants.poyntCollect.iFrame,
          additionalFieldsToValidate: constants.poyntCollect.additionalFieldsToValidate,
          locale: constants.poyntCollect.locale,
          displayComponents: constants.poyntCollect.displayComponents,
          style: constants.poyntCollect.style,
          customCss: constants.poyntCollect.customCss
        });
      }
    }).catch((error) => {
      if (setLoading) {
        setLoading(false);
      }

      console.log(error);
    });

    collect.current.on("iframe_ready", () => {
      if (setLoading) {
        setLoading(false);
      }
    });

    if (options.requireShippingAddress) {
      collect.current.on("shipping_address_change", (event) => {
        order.shippingCountry = event.shippingAddress.countryCode;
      
        if (order.shippingCountry === "US") {
          order.taxRate = 0.1;
        } else {
          order.taxRate = 0.3;
        }
      
        const shippingMethods = getShippingMethods(order);

        if (!shippingMethods?.length) {
          event.updateWith({
            error: {
              code: "unserviceable_address",
              contactField: "country",
              message: "No shipping methods available for selected shipping address",
            }
          });
        }
      
        const selectedShippingMethod = shippingMethods[0];
        const total = buildTotal(order, selectedShippingMethod);
        const lineItems = buildLineItems(order, selectedShippingMethod);
  
        const options = {
          lineItems: lineItems,
          shippingMethods: shippingMethods,
          total: total,
        };
      
        event.updateWith(options);
      });
      
      collect.current.on("shipping_method_change", (event) => {
        const total = buildTotal(order, event.shippingMethod);
        const lineItems = buildLineItems(order, event.shippingMethod);
        
        const options = {
          lineItems: lineItems,
          total: total
        };
  
        event.updateWith(options);
      });
    }

    if (options.supportCouponCode) {
      collect.current.on("coupon_code_change", (event) => {
        if (!event.couponCode) {
          order.coupon = {
            code: "",
            label: "",
            amount: "0.00",
          }
        } else {
          const couponCode = availableCouponCodes.find(item => item.code === event.couponCode);
  
          if (!couponCode) {
            const options = {
              error: {
                code: "invalid_coupon_code",
                message: "Coupon code " + event.couponCode + " does not exists", 
              }
            };
      
            return event.updateWith(options);
          }
      
          order.coupon = couponCode;
        }

        const shippingMethods = walletRequest.requireShippingAddress ? getShippingMethods(order) : null;
        const selectedShippingMethod = walletRequest.requireShippingAddress ? shippingMethods[0] : null;
        const total = buildTotal(order, selectedShippingMethod);
        const lineItems = buildLineItems(order, selectedShippingMethod);
          
        const options = {
          lineItems: lineItems,
          shippingMethods: shippingMethods,
          couponCode: { ...order.coupon },
          total: total,
        };
      
        event.updateWith(options);
      });
    }

    collect.current.on("close_wallet", (event) => {
      console.log('wallet closed', event);
    });

    collect.current.on("payment_authorized", (event) => {
      if (event.source === "google_pay") {
        console.log("GOOGLE PAY PAYMENT AUTHORIZED EVENT DATA: ", event);
      }

      if (event.source === "apple_pay") {
        console.log("APPLE PAY PAYMENT AUTHORIZED EVENT DATA: ", event);
      }

      Promise.resolve(onNonce(event.nonce)).then(() => {
        event.complete();
      });
    });
    
    collect.current.on("nonce", (nonce) => {
      setButtonLoading(false);
      onNonce(nonce);
    });

    collect.current.on("error", (event) => {
      let message;

      console.log(event);

      if (event?.data?.message) {
        message = event.data.message;
      }

      if (event?.data?.error?.type === 'invalid_details' || event?.data?.error?.type === 'missing_fields') {
        message = event.data.error.message === 'Missing details' ? 'Enter a card number' : event.data.error.message;
      }

      if (event?.data?.errorType === "invalidEmail" || event?.data?.errorType === "invalidZip") {
        message = event?.data?.error;
      }

      if (message) {
        setButtonLoading(false);

        if ($("#__react-alert__ span").text() === message) {
          return;
        }

        alert.error(message);
      }
    });

    return () => {
      collect.current.unmount(collectId, document);
      collect.current = null;
    };
  }, [
    cartItems,
    cartTotal,
    couponCode,
    collectId,
    options.paymentMethods?.card,
    options.paymentMethods?.applePay,
    options.paymentMethods?.googlePay,
    options.requireEmail,
    options.requirePhone,
    options.requireShippingAddress,
    options.supportCouponCode,
    setLoading,
    alert,
    onNonce
  ]);

  const button = (
    <Button className="poynt-collect-button" loading={buttonLoading} onClick={() => getNonce()}>Pay with card</Button>
  );

  return ( 
    <div id={collectId} className="poynt-collect">
      {options.paymentMethods?.card ? button : null}
    </div>
  );
};

export default PoyntCollect;
