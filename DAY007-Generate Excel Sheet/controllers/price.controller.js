const createExcelFile = require("../utils/excel");

const downloadExcel = async (req, res) => {
  const body = req.body;
  await createExcelFile(res, body);
};

module.exports = {
  downloadExcel,
};
