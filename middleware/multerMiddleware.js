const multer = require("multer");

const storage = multer.memoryStorage(); // stores file in memory as buffer
const upload = multer({ storage });

module.exports = upload;
