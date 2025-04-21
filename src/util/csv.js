const csvToObj = (csvString) => {
  if (typeof csvString !== "string" || csvString.trim() === "") {
    throw new Error("Input must be a non-empty CSV string");
  }

  const [headerLine, ...lines] = csvString
    .split("\n")
    .map((line) => line.trim());
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header] =
        values[index]?.replace(/^"|"$/g, "").replace(/""/g, '"') || null;
      return obj;
    }, {});
  });
};

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
  csvToObj,
  objToCsv,
};
