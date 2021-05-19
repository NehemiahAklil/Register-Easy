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

export const purge = async(ctx:MyContext) => {
    await Contact.deleteMany()
    ctx.reply('Succecfully Purged Database');
}
export const askPurge = async(ctx:MyContext) => {
    if(process.env.DEV_ID){
        if(!(process.env.DEV_ID === ctx.from?.id.toString())){
            return ctx.reply("Sorry, this commander is for developer only");
        }
        return ctx.reply('Are you sure you want to purge database',Markup.inlineKeyboard(
            [
                Markup.button.callback('Yes Purge everything','PURGE'),
                Markup.button.callback('NO My Bad','NO_PURGE')
            ]
        ));
    }
    return ctx.reply("I don't have a dev so I ain't doing shit");
}