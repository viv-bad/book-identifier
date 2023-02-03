const yearify = (year) => {
  if (year.includes(",")) {
    return year.split(", ")[1];
  }
  if (year.includes("-")) {
    return year.split("-")[0];
  }
  if (
    year.startsWith("J") ||
    year.startsWith("F") ||
    year.startsWith("M") ||
    year.startsWith("A") ||
    year.startsWith("S") ||
    year.startsWith("O") ||
    year.startsWith("N") ||
    year.startsWith("D")
  ) {
    return year.split(" ")[1];
  } else {
    return year;
  }
};

module.exports = yearify;
