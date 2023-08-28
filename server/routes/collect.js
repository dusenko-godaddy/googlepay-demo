const util = require("util");
const cors = require('cors');
const router = require("express").Router();

const poynt = require("../lib/poynt");

const corsOptions = {
  origin: ['https://pay-demo-dev.web.app', 'http://localhost:3000', 'http://localhost:3001']
};

router.options("/charge", cors(corsOptions));
router.post("/charge", cors(corsOptions), async (req, res) => {
  console.log(JSON.stringify(req.body));

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

    return res.status(200).send(charge);
  } catch (err) {
    console.log("Charge failed", err);

    return res.status(400).send({
      message: err?.message || 'Unknown error',
    });
  }
});

module.exports = router;
