import { defaultShippingMethods } from '../common/data';

export const createOrder = (cartItems) => {
  return {
    total: {
      label: "TOTAL",
      amount: (cartItems || []).reduce((sum, curr) => sum += curr.price, 0).toString(),
    },
    lineItems: (cartItems || []).map(item => {
      return {
        label: item.name,
        amount: item.price.toString(),
      }
    }),
    taxRate: 0.0,
    coupon: {
      code: "",
      label: "",
      amount: "0.00",
    },
    shippingCountry: "US",
  };
};

export const buildLineItems = (order, selectedShippingMethod) => {
  const lineItems = order.lineItems.map(item => { return { ...item } });
  
  if (order.taxRate) {
    const tax = order.taxRate * parseFloat(order.total.amount);

    lineItems.push({
      label: "Tax",
      amount: tax.toString(),
    });
  }

  if (selectedShippingMethod) {
    lineItems.push({
      label: selectedShippingMethod.label,
      amount: selectedShippingMethod.amount,
    });
  }

  if (order.coupon.code) {
    lineItems.push({ ...order.coupon });
  }

  return lineItems;
};

export const buildTotal = (order, selectedShippingMethod) => {
  const tax = order.taxRate * parseFloat(order.total.amount);

  let totalAmount = parseFloat(order.total.amount) + tax;

  if (selectedShippingMethod) {
    totalAmount += parseFloat(selectedShippingMethod.amount);
  }

  //Add coupon code to total amount
  if (order.coupon.code) {
    totalAmount += parseFloat(order.coupon.amount || "0.00");
  }

  if (totalAmount <= 0) {
    totalAmount = 0.01;
  }

  return {
    amount: totalAmount.toString(),
    label: order.total.label,
    isPending: false,
  };
};


export const getShippingMethods = (order) => {
  let shippingMethods;

  if (order.shippingCountry === "CA") {
    return [];
  }

  if (order.shippingCountry === "US") {
    shippingMethods = defaultShippingMethods[order.coupon.code === "free" ? "US_FREE" : "US"];
  } else {
    shippingMethods = defaultShippingMethods[order.coupon.code === "free" ? "OTHER_FREE" : "OTHER"];
  }

  return (shippingMethods || []).map(item => { return { ...item } });
};
