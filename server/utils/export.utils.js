import ExcelJS from "exceljs"

export async function exportExcel(columns, data, fileName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    worksheet.columns = columns;
    data.forEach(row => worksheet.addRow(row));

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // await workbook.xlsx.write(res);
    // res.end();
    return { workbook }
}