const Excel = require("exceljs");

const createExcelFile = async (res, body) => {
  const requestBody = [
    {
      serviceInfo: [
        {
          Type: {
            cloudServiceType: "hws.service.type.ec2",
            priceCode: "x86 | dedicated-general-purpose | c6s | 2 vCPUs | 4GB",
            resourceType: "hws.resource.type.vm",
            resourceSize: 0,
            price: 77.52,
            displayName:
              "x86 | Dedicated General Purpose | c6s.large.2 | 2 vCPUs | 4GB",
            exportPosition: 1,
          },
        },
        {
          "System Disk": {
            cloudServiceType: "hws.service.type.ebs",
            priceCode: "SAS",
            resourceType: "hws.resource.type.volume",
            resourceSize: 40,
            price: 5.52,
            displayName: "High I/O  | 40 GB",
            exportPosition: 2,
          },
        },
        {
          Image: {
            cloudServiceType: "hws.service.type.image",
            priceCode: "windows | windows-standard",
            resourceType: "hws.resource.type.imageType",
            resourceSize: "",
            price: 0,
            displayName: "Windows | Standard",
            exportPosition: 3,
          },
        },
        {
          EIP: {
            cloudServiceType: "hws.service.type.vpc",
            priceCode: "eipas | dynamic_bgp | 19_bgp | bandwidth",
            resourceType: "hws.resource.type.bandwidth",
            resourceSize: 5,
            price: 85.5,
            displayName: "Dynamic BGP | Exclusive | Bandwidth | 5 Mbit/s",
            exportPosition: 4,
          },
        },
      ],
      uuid: "4a16054e-68ec-4729-874f-e1094a8705d2",
      serviceName: "ECS",
    },
    {
      serviceInfo: [
        {
          "Data Disk": {
            cloudServiceType: "hws.service.type.ebs",
            priceCode: "SAS",
            resourceType: "hws.resource.type.volume",
            resourceSize: 10,
            price: 1.38,
            displayName: "High I/O  | 10 GB",
          },
        },
      ],
      uuid: "f7b5a7ae-eafb-46c1-99df-7b58e6148417",
      serviceName: "EVS",
    },
  ];

  //create the workbook
  const workbook = new Excel.Workbook();

  //create the work sheet
  const worksheet = workbook.addWorksheet("sheet1");

  //generate columns
  worksheet.columns = [
    { header: "Service", key: "service", width: 40 },
    { header: "Region", key: "region", width: 70 },
    { header: "AZ", key: "az", width: 20 },
    { header: "Billing Mode", key: "billingMode", width: 20 },
    { header: "Price", key: "price", width: 20 },
  ];

  //merge cell
  worksheet.mergeCells("A1:E1");
  const titleRow = worksheet.getRow(1);

  titleRow.getCell(1).value = `Price Calculator - Date`;

  titleRow.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ea4433" },
  };

  titleRow.height = 30;

  titleRow.getCell(1).font = {
    bold: true,
    color: { argb: "FFFFFF" },
    size: 14,
  };

  titleRow.getCell(1).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // add header to the worksheet
  //these keys are related to the keys of columns
  worksheet.addRow({
    service: "Service",
    region: "Region",
    az: "AZ",
    billingMode: "Billing Mode",
    price: "Price (USD)",
  });

  //create header row
  const headerRow = worksheet.getRow(2);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "898c8a" },
    };

    cell.font = {
      bold: true,
      color: { argb: "1e313d" },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  });

  let rowCount = 2;
  let parentRowNumbers = [];
  let childRowNumbers = [];

  const bodyRows = requestBody.map(async (service, index) => {
    //increase row count

    let total = 0;

    let { serviceInfo, serviceName } = service;

    rowCount++;
    parentRowNumbers.push(rowCount);

    let childRows = serviceInfo.map((item) => {
      const key = Object.keys(item)[0];
      const valueObject = item[key];

      total += valueObject.price;

      rowCount++;
      childRowNumbers.push(rowCount);

      return {
        service: key,
        region: valueObject.displayName,
        az: "",
        billingMode: "Monthly",
        price: valueObject.price,
      };
    });

    childRows = await Promise.all(childRows);

    // add service row
    worksheet.addRow({
      service: serviceName,
      region: "AS-Colombo-Orel-IT",
      az: "AZ1",
      billingMode: "Monthly",
      price: total,
    });

    worksheet.addRows(childRows);
  });

  await Promise.all(bodyRows);

  parentRowNumbers.forEach((row) => {
    let parentRow = worksheet.getRow(row);
    parentRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  });

  childRowNumbers.forEach((row) => {
    let childRow = worksheet.getRow(row);
    childRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "e3e6e4" },
      };
      cell.font = {
        color: { argb: "9e8f90" },
      };
    });
  });

  worksheet.getColumn("E").alignment = {
    horizontal: "right",
  };

  worksheet.getColumn("D").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");

  await workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      res.send(buffer);
    })
    .catch((err) => console.log(err));
};

module.exports = createExcelFile;
