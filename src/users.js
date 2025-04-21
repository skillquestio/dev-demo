const { objToCsv } = require("./util/csv");
const { writeToFile } = require("./util/file");
const { user } = require("./objects");
const path = require("path");

const run = () => {
  writeToFile(
    path.join(process.cwd(), "data", "Users.csv"),
    objToCsv(Array.from({ length: 20 }, () => user()))
  );

  console.log("Users written to data/users.csv");
};

run();
