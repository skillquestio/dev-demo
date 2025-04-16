const generateRandomString = (
  length,
  options = { letters: true, numbers: true }
) => {
  const defaultOptions = { letters: true, numbers: true };
  if (!options) {
    options = defaultOptions;
  }
  let chars = "";
  if (options.letters) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) chars += "0123456789";

  if (!chars) {
    throw new Error("At least one of 'letters' or 'numbers' must be true");
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomDate = (daysAgo) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * daysAgo));
  return pastDate.toISOString();
};

module.exports = {
  generateRandomString,
  generateRandomDate,
};
