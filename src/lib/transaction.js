export const chargeNonce = async (nonce, request) => {
  console.log("NONCE RECEIVED", nonce);
  console.log('charging...');

  const data = await fetch('http://localhost:1347/collect/charge', {
    method: "POST",
    body: { nonce, request },
  });

  const result = await data.json();
  console.log('SUCCESSFUL CHARGE', result);
  
  emptyCart();
  navigate("/success-page");
};