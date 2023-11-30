const util = require("util");
const router = require("express").Router();

const poynt = require("../lib/poynt");

router.post("/charge", async (req, res) => {
  console.log(JSON.stringify(req.body));

  // const asyncGetBusiness = util.promisify(poynt.getBusiness).bind(poynt);
  // const business = await asyncGetBusiness({
  //   businessId: global.configs.businessId
  // });

  // return res.status(200).send(business);

  try {
    const asyncChargeToken = util.promisify(poynt.chargeToken).bind(poynt);
    const charge = await asyncChargeToken({
      businessId: global.configs.businessId,
      action: "SALE",
      amounts: {
        transactionAmount: req.body.amount,
        orderAmount: req.body.amount,
      },
      currency: "USD",
      nonce: req.body.nonce,
      emailReceipt: !!req.body.emailAddress,
      partialAuthEnabled: false,
      receiptEmailAddress: req.body.emailAddress,
      source: "WEB",
    });

    if (charge && charge.status === 'DECLINED') {
      const processorCode = charge.processorResponse?.statusCode || 'unknown';
      const processorMessage = charge.processorResponse?.statusMessage || 'unknown';

      return res.status(400).send({
        message: `Transaction declined. Status code: ${processorCode}. Status message: ${processorMessage}`,
      });
    }

    console.log("Charge success", JSON.stringify(charge));

    return res.status(200).send(charge);
  } catch (err) {
    console.log("Charge failed", err);

    return res.status(400).send({
      message: err?.message || 'Unknown error',
    });
  }
});

module.exports = router;
