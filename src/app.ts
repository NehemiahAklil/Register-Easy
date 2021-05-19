import {Telegraf, Scenes,session, Context} from 'telegraf';
import {conatactRegisterationWizard} from './scene'
import{MyContext} from './context.interface'
import {askPurge, count, purge, reportExcel, start} from './commands'
import './database'

import Dotenv from 'dotenv'
Dotenv.config();

const token = process.env.BOT_TOKEN;
if(!token){
    throw new Error('BOT_TOKEN must be provided')
}
const bot = new Telegraf<MyContext>(token);

const stage = new Scenes.Stage<MyContext>([conatactRegisterationWizard])
bot.use(session());
bot.use((ctx,next) => {
    const now = new Date();
    ctx.myContextProp = now.toString();
    console.log(now);
    return next();
})
bot.use(stage.middleware());
bot.action('REG_EVENT',(ctx) => ctx.scene.enter('REG_CONTACT_INFO'))
bot.action('ABOUT_EVENT',(ctx) => ctx.replyWithPhoto({source:'./assets/event.jpg'},{caption:'ልዩ የትምህርት ጊዜ ከ ፓስተር መስፍን ማሞ እና ፓ/ር ሐብቴ አዳነ  ጋር፤ በተጠቀሱት ስልክ ቁጥሮች እየደወላችሁ ተመዝገቡ።'}))

bot.start((ctx) => start(ctx))
bot.command('report',(ctx) => reportExcel(ctx))
bot.command('purge',(ctx) => askPurge(ctx))
bot.command('count',(ctx) => count(ctx))
bot.action('PURGE',(ctx) => purge(ctx))
bot.action('NO_PURGE',(ctx) => {
    ctx.reply('Purge Has Been Stopped')
})
if(process.env.PORT){
    bot.launch({
        webhook: {
          domain: process.env.BOT_DOMAIN,   
          port: Number(process.env.PORT),
        }
    }
    ).then(() => console.log(new Date(), bot.botInfo?.first_name.trim(), `Bot Started on webhook ${process.env.PORT}`));
}else{
    bot.launch().then(() => console.log(new Date(), bot.botInfo?.first_name.trim(), `Bot Started Polling`));

}


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))