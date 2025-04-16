const fs = require("fs");
const path = require("path");

const writeToFile = (filePath, data) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data, "utf8");
};

module.exports = {
  writeToFile,
};
