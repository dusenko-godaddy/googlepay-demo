import $ from 'jquery';
import { useAlert } from 'react-alert';
import Button from 'react-bootstrap-button-loader';
import { useLayoutEffect, useRef, useState } from 'react';

import './PoyntCollect.css';

import constants from '../../lib/common/constants';
import { availableCouponCodes } from '../../lib/common/data';
import { createOrder, buildLineItems, buildTotal, getShippingMethods } from '../../lib/helpers/wallet';

const parseMesasge = (event) => {
  ///http request error
  if (event?.data?.developerMessage || event?.data?.message) {
    return {
      message: event.data.developerMessage || event.data.message,
      type: 'ERROR',
    };
  }

  if (event?.data?.error?.source === 'submit') {
    const message = event.data.error.message;

    if (event.data.error.type === 'card_on_file') {
      return {
        message: 'Unable to save card on file: ' + message,
        type: 'WARN',
      };
    }

    return {
      message,
      type: 'ERROR',
    };
  }
};

const PoyntCollect = ({
  setLoading,
  options,
  collectId,
  onNonce,
  cartItems,
  cartTotal,
  couponCode
}) => {
  const alert = useAlert();
  const collect = useRef();
  const [buttonLoading, setButtonLoading] = useState(false);

  const getNonce = () => {
    setButtonLoading(true);
    collect.current.getNonce({});
  };

  useLayoutEffect(() => {
    let componentRemoved = false;

    if (setLoading) {
      setLoading(true);
    }

    const order = createOrder(cartItems, cartTotal, options.couponCode);

    const walletRequest = {
      merchantName: options.merchantName || constants.poyntCollect.merchantName,
      country: options.country || constants.poyntCollect.country,
      currency: options.currency || constants.poyntCollect.currency,
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

    collect.current = new window.TokenizeJs(
      options.businessId || constants.poyntCollect.businessId,
      options.applicationId || constants.poyntCollect.applicationId,
      walletRequest
    );

    const supportWalletPaymentsOptions = {
      // emailAddress: "pazesmangal@godaddy.com",
      // emailAddress: "dusenko@godaddy.com",
    };
    
    collect.current.supportWalletPayments(supportWalletPaymentsOptions).then((result) => {
      if (!collect.current || componentRemoved) {
        return;
      }

      const paymentMethods = [];

      if (options.paymentMethods?.card) {
        paymentMethods.push("card");
      }

      if (options.paymentMethods?.applePay && result.applePay) {
        paymentMethods.push("apple_pay");
      } 
      
      if (options.paymentMethods?.googlePay && result.googlePay) {
        paymentMethods.push("google_pay");
      }

      if (options.paymentMethods?.paze && result.paze) {
        paymentMethods.push("paze");
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
          customCss: constants.poyntCollect.customCss,
          inlineErrors: constants.poyntCollect.inlineErrors,
          fields: constants.poyntCollect.fields,
          // enableReCaptcha: true,
        });
      } else {
        if (setLoading) {
          setLoading(false);
        }
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
      
        // if (order.shippingCountry === "US") {
        //   order.taxRate = 0.1;
        // } else {
        //   order.taxRate = 0.3;
        // }
      
        const shippingMethods = getShippingMethods(order);

        if (!shippingMethods?.length) {
          return event.updateWith({
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
          order.coupon = null;
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

    collect.current.on("wallet_button_click", (event) => {
      console.log("wallet_button_click", event);

      if (event.source === "paze") {
        setLoading(true);
      }
    });

    collect.current.on("close_wallet", (event) => {
      console.log('close_wallet', event);

      if (event.source === "paze") {
        setLoading(false);

        if (event.error?.message) {
          if ($("#__react-alert__ span").text() === event.error.message) {
            return;
          }
  
          alert.error(event.error.message);
        }
      }
    });

    collect.current.on("payment_authorized", async (event) => {
      if (event.source === "google_pay") {
        console.log("GOOGLE PAY PAYMENT AUTHORIZED EVENT DATA: ", event);
      }

      if (event.source === "apple_pay") {
        console.log("APPLE PAY PAYMENT AUTHORIZED EVENT DATA: ", event);
      }

      if (event.source === "paze") {
        console.log("PAZE PAYMENT AUTHORIZED EVENT DATA: ", event);
      }

      try {
        const data = {
          nonce: event.nonce,
          emailAddress: event.billingAddress?.emailAddress,
        };

        await Promise.resolve(onNonce(data, walletRequest));
        event.complete();
      } catch(error) {
        if (setLoading) {
          setLoading(false);
        }

        if (event.source === "paze" && error?.message) {
          if ($("#__react-alert__ span").text() === error.message) {
            return;
          }
  
          alert.error(error.message);
        }

        event.complete({ error });
      }
    });
    
    collect.current.on("nonce", async (event) => {
      try {
        await Promise.resolve(onNonce(event.data, walletRequest));
        setButtonLoading(false);
      } catch(error) {
        setButtonLoading(false);
        console.log(error);
      }
    });

    collect.current.on("error", (event) => {
      console.log("error", event);

      const error = parseMesasge(event);

      if (error) {
        if (error.type === 'WARN') {
          return alert.info(error.message);
        }

        setButtonLoading(false);

        if ($("#__react-alert__ span").text() === error.message) {
          return;
        }

        alert.error(error.message);
      }
    });

    return () => {
      componentRemoved = true;
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
    options.paymentMethods?.paze,
    options.businessId,
    options.applicationId,
    options.merchantName,
    options.country,
    options.currency,
    options.requireEmail,
    options.requirePhone,
    options.requireShippingAddress,
    options.supportCouponCode,
    options.couponCode,
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
