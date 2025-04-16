const fs = require("fs");
const path = require("path");

const objToCsv = (objects) => {
  if (!Array.isArray(objects) || objects.length === 0) {
    throw new Error("Input must be a non-empty array of objects");
  }

  const headers = Object.keys(objects[0]);
  const csvRows = [headers.join(",")];

  objects.forEach((obj) => {
    const row = headers
      .map((header) => {
        const value = obj[header];
        return typeof value === "string"
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
      .join(",");
    csvRows.push(row);
  });

  return csvRows.join("\n");
};

module.exports = {
  objToCsv,
};
