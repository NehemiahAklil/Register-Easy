import Excel from 'exceljs';
import { ExcelContact, MyContext } from './context.interface';
import { IContact } from './database/model';

export const writeToExcel = async(data:IContact[],ctx:MyContext) => {
    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('Registaration List')
    worksheet.columns = [
        {header: 'ID', key:'id'},
        {header: 'First Name', key:'firstName',width:12},
        {header: 'Last Name', key: 'lastName',width:12},
        {header: 'Phone Number', key: 'phoneNumber',width:14.5}
    ]
    // worksheet.columns.forEach(column => {
    //     if(column.header?.length){
    //         column.width = column.header?.length < 12 ? 12 : column.header?.length
    //     }
    // })
    worksheet.getRow(1).font = {bold:true};

    data.forEach((e, index) => {
        const contact = {firstName:e.firstName,lastName:e.lastName,phoneNumber:e.phoneNumber};
        const rowIndex = index + 2
        worksheet.addRow({
        ...contact,
        id: {
            formula: `= ROW(${rowIndex}:${rowIndex}) - 1`
        }
        })
    })
    console.log('Creating xlsx file')
    await workbook.xlsx.writeFile('./export.xlsx')
    console.log('Sending excel file')
    await ctx.telegram.sendDocument("@registerationKSprogram",{source:'./export.xlsx',filename:`export${data.length}`}).catch(console.log);
}