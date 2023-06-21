const XLSX = require("xlsx");
const axios = require("axios");
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("./src/s3");

const BUCKET = "sygnamax-image-bucket";

//extract data
const excelFile = "./signamax-data.xlsx";
const workBook = XLSX.readFile(excelFile);
const sheetName = workBook.SheetNames[1];
const workSheet = workBook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(workSheet);

//download image from urls
const imageCol = "url";
const imageFolder = "./images";

console.log(imageFolder);

const downloadImage = async (imageUrl, imageFilename) => {
  const imagePath = path.join(imageFolder, imageFilename);
  const res = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(res.data, "binary");
  fs.writeFileSync(imagePath, imageBuffer);
};

//unique name
function generateUniqueFileName() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomString}`;
}

//insert data into db
const insertIntoDb = async (data, s3FileUrl) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sygnamax",
    port: "3306",
  });

  try {
    await connection.query(
      "\
        INSERT INTO products \
        (title, url, status) VALUES \
        (?, ?, ?) \
        ",
      [data.title, s3FileUrl, data.status]
    );
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

const uploadImageAndInsertData = async () => {
  // loop
  jsonData.forEach(async (i, index) => {
    const imageUrl = i[imageCol];
    const imageFilename = `image_${index}.jpg`;
    await downloadImage(imageUrl, imageFilename);

    // fileContent;
    const imagePath = path.join(imageFolder, imageFilename);
    const fileContent = fs.readFileSync(imagePath);

    console.log("file content", fileContent);

    //key
    const uniqueName = generateUniqueFileName();
    const fileName = uniqueName + imageFilename;
    const key = `/sygnamax/images/${fileName}`;

    console.log("key", key);

    const uploadRes = await uploadFile(fileContent, key);
    console.log("uploadRes", uploadRes);

    const s3FileUrl = `https://${BUCKET}.s3.amazonaws.com${key}`;

    await insertIntoDb(i, s3FileUrl);
  });
};

try {
  uploadImageAndInsertData();
} catch (error) {
  console.log(error);
}
