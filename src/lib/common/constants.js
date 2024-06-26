const fonts = '"GD Sherpa", "objektiv-mk2", "Proxima Nova", "Myriad Pro", -apple-system, Helvetica';

const constants = {
  poyntCollect: {
    // businessId: "17ce7699-3aa8-4484-bdc2-864eb0161f5c", //OTE
    businessId: "afabc7eb-8864-47aa-ad8a-83e734940ebb", //PROD
    // businessId: "33eb2e79-d186-44b8-badb-7e62e6651344", //PROD CA
    // applicationId: "urn:aid:edc43aed-1d65-4707-b4e0-c242f867eea7", //OTE
    applicationId: "urn:aid:5ddfcd36-65d5-4802-9866-a65516914512", //PROD
    // applicationId: "urn:aid:4c0e5603-1ef1-4d30-911e-fb9fca592f0c", //PROD CA
    merchantName: "GoDaddy Merchant",
    country: "US",
    currency: "USD",
    iFrame: {
      width: "100%",
      height: "490px",
      border: "0px",
    },
    inlineErrors: true,
    locale: "en-US",
    displayComponents: {
      paymentLabel: true,
      labels: true,
      firstName: true,
      lastName: true,
      emailAddress: true,
      phone: true,
      zipCode: true,
      line1: true,
      line2: true,
      city: true,
      territory: true,
      countryCode: true,
      // ecommerceFirstName: true,
      // ecommerceLastName: true,
      // ecommerceEmailAddress: true,
      // submitTokenButton: true,
      collectShippingAddress: true,
      showShippingAddressSameAsBillingCheckbox: true,
      shippingLine1: true,
      shippingLine2: true,
      shippingCity: true,
      shippingTerritory: true,
      shippingZip: true,
    },
    additionalFieldsToValidate: [
      "zipCode",
      "firstName",
      "lastName",
      "emailAddress",
      "line1",
      // "line2",
      "city",
      "territory",
      "countryCode",
      "phone",
      "shippingLine1",
      // "shippingLine2",
      "shippingCity",
      "shippingTerritory",
      "shippingZip"
    ],
    fields: {
      firstName: "Susie",
      lastName: "Hickle",
      emailAddress: "test@test.test",
      phone: "(514) 842-1336",
      zipCode: "T5E 1X9",
      line1: "8316 137 Ave NW",
      city: "Edmonton",
      territory: "AB",
      countryCode: "CA",
    },
    style: {
      theme: "ecommerce",
    },
    customCss: {
      container: {
        color: "#111",
        "font-family": fonts,
        height: "auto",
        "flex-flow": "row wrap",
        "justify-content": "normal",
        "align-content": "center",
        "margin": "0 auto",
        "margin-top": "-15px",
      },
      inputLabel: {
        color: "#111",
        display: "block",
        "font-size": "15px",
        "font-weight": "700",
        "line-height": "20px",
        "margin-bottom": "7.5px",
        "margin-top": "5px",
        "text-transform": "capitalize",
        "letter-spacing": "0px",
      },
      inputDefault: {
        color: "#111",
        "font-family": fonts,
        "font-size": "15px",
        "line-height": "20px",
      },
      sectionLabel: {
        "font-size": "13px",
        "line-height": "18px",
        "font-weight": "500",
        "letter-spacing": "0.5px",
        color: "#767676",
        "text-transform": "uppercase",
        "margin-top": "15px",
        "margin-bottom": "10px",
        "padding-left": "0px",
        "padding-right": "0px",
      },
      requiredMark: {
        color: "#ae1302",
        "font-size": "15px",
        "line-height": "20px",
        "margin-left": "3px",
      },
      rowFirstName: {
        width: "50%",
        "padding-left": "0px",
      },
      rowLastName: {
        width: "50%",
        "padding-right": "0px",
      },
      rowCardNumber: {
        width: "75%",
        "padding-left": "0px",
      },
      rowCVV: {
        width: "35%",
        "padding-left": "0px",
      },
      rowExpiration: {
        width: "25%",
        "padding-right": "0px",
      },
      rowZip: {
        width: "65%",
        "padding-right": "0px",
      },
      rowEmailAddress: {
        width: "100%",
        "margin-bottom": "3px",
        "padding-left": "0px",
        "padding-right": "0px",
      },
    },
  },
};

export default constants;
