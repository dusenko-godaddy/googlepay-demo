const poynt = require("poynt")({
  env: global.configs.env,
  applicationId: global.configs.applicationId,
  filename: __dirname + "/keypair-prod.pem",
});

module.exports = poynt;
