import {Markup} from 'telegraf';
import { MyContext } from './context.interface';


export const start = async(ctx:MyContext) => {
    ctx.reply('Welcome I am here to make your registeration easier. What would you like to do?',
    Markup.inlineKeyboard([
        Markup.button.callback('Register For Event 📋', 'REG_EVENT'),
        Markup.button.callback('Read About Event ❔', 'ABOUT_EVENT'),
      ]))
}