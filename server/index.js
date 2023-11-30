const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const corsOptions = {
  origin: ['https://pay-demo-9577e.web.app', 'http://localhost:3000', 'http://localhost:3001']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static("public"));

// global configs
global.configs = require("./lib/configs-prod");

app.use("/collect", require("./routes/collect"));
app.use("/logs", require("./routes/logs"));

const port = 1347;
app.listen(port, () => {
  console.log(`Google Pay Node JS app listening at ${port}`);
});
