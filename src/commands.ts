import {Markup} from 'telegraf';
import { MyContext } from './context.interface';
import { writeToExcel } from './writeExecl';
import  Contact from './database'


export const start = async(ctx:MyContext) => {
    ctx.reply('Welcome I am here to make your registeration easier. What would you like to do?',
    Markup.inlineKeyboard([
        Markup.button.callback('Register For Event 📋', 'REG_EVENT'),
        Markup.button.callback('Read About Event ❔', 'ABOUT_EVENT'),
      ]))
}
export const reportExcel = async(ctx:MyContext) => {
    await ctx.reply('Generating Excel File...');
    const contactList = await Contact.find();
    await writeToExcel(contactList,ctx)
    return ctx.reply('Sent Registered Report');   
}