const fs = require('fs');
const path = require('path');
const router = require("express").Router();

const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const writeLogToFile = (message) => {
  // Get the current date and time for timestamp
  const timestamp = new Date().toISOString();

  // Format the log entry
  const logEntry = `${timestamp}: ${message}\n`;

  // Specify the path to the log file
  const logFileName = `log_${getFormattedDate()}.txt`;
  const logFilePath = path.join(__dirname, '../logs/', logFileName);
  console.log(logFilePath);

  // Write the log entry to the file
  fs.writeFileSync(logFilePath, logEntry, { flag: 'a' }); // 'a' stands for append
};

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const message = JSON.stringify(req.body);
    console.log(message);
  
    writeLogToFile(message);
  } catch (error) {
    console.log('Error writing to log file: ', error);
  }
});

module.exports = router;
