import { Scenes,Composer,Markup} from 'telegraf';
import { ContactInfo, MyContext,ExcelContact } from './context.interface';
import { writeToExcel } from './writeExecl';
import * as _ from 'lodash';

import  Contact from './database'
const stepHandler = new Composer<MyContext>()
stepHandler.command('cancel',async(ctx) =>{
    await ctx.reply('Canceled Registeation')
    ctx.scene.leave();
})
stepHandler.on('text',async (ctx) => {
    console.log('Step 2') 
    const currentStepIndex = ctx.wizard.cursor;
    if(ctx.message.text.length < 3){
        await ctx.reply('Please Enter Your Real Name');
        return ctx.wizard.selectStep(currentStepIndex);
    } else if(ctx.message.text === '🔙Back'){
        await ctx.reply('Send me your name again');
        return ctx.wizard.selectStep(currentStepIndex);
    }
    ctx.session.contactInfo = {fullName : ctx.message.text};
    await ctx.replyWithHTML('Press <b>"Share My Contact"</b> button or Send a list of Phone Number',
    Markup.keyboard([
        Markup.button.contactRequest('Share My Contact ☎'),
      ]).resize());
    return ctx.wizard.next();
})
stepHandler.use(async(ctx) =>{
    console.log('Step 2')
    await ctx.reply('Reply with Back', Markup.keyboard(['🔙Back']))
})


export const conatactRegisterationWizard = new Scenes.WizardScene(
    'REG_CONTACT_INFO',
    async(ctx) => {
        console.log('Step 1')
        await ctx.replyWithHTML(`
        <b>Send Your Full Name to Start Registration</b> 
<b>Note:</b> If you're trying to register multiple people please write each name on a new line.
<b>Example:</b> 
    Nehemiah Aklil
    Ezra Aklil
    Lemi Desalign
    Lidiya Anteneh
        `,{});
        return ctx.wizard.next();
    },
    stepHandler,
    async (ctx) => {
        if(ctx.message && "text" in ctx.message){
            console.log(ctx.message);
            ctx.session.contactInfo = {telephone : ctx.message.text,...ctx.session.contactInfo};
            await ctx.reply('Thanks For Registering',Markup.removeKeyboard());
            await displayContact(ctx.session.contactInfo,ctx)
            return ctx.scene.leave();
        }
        else{
            if(ctx.message && "contact" in ctx.message){
                const phone = ctx.message.contact.phone_number.replace("+251","0");
                ctx.session.contactInfo = {telephone : phone,...ctx.session.contactInfo};
                await ctx.reply('Thanks For Registering',Markup.removeKeyboard());
                await displayContact(ctx.session.contactInfo,ctx)
                return ctx.scene.leave();
            }
            console.log(ctx.message);
            const currentStepIndex = ctx.wizard.cursor - 1;
            return ctx.wizard.selectStep(currentStepIndex);
        }
    }
)

const displayContact = async (contactInfo : ContactInfo,ctx:MyContext) => {
    if(contactInfo.fullName && contactInfo.telephone){
        const fullNames : string[] = contactInfo.fullName?.split('\n');
        const telephones : string[]= contactInfo.telephone?.split('\n');
        const firstNames : string[] = [];
        const lastNames : string[] = [];
        fullNames.forEach(fullName => {
            firstNames.push(_.capitalize(fullName.split(/\s+/)[0]))
            lastNames.push(_.capitalize(fullName.split(/\s+/)[1]))
        })
        const excelContact : ExcelContact[] = [];

        for(let i = 0; i < fullNames?.length;i++){
            if(fullNames && telephones){
                console.log(`${<string>fullNames![i]} ${<string>telephones![i]}`)
                excelContact.push({firstName:firstNames[i],lastName:lastNames[i],phoneNumber:telephones[i]})
            }
        }
        for(let i in excelContact){
            await Contact.create({firstName:excelContact[i].firstName,lastName:excelContact[i].lastName,phoneNumber:excelContact[i].phoneNumber});
            const count = await Contact.countDocuments();
            console.log('Count is ',count)
            if (count % 5 == 0){
                const contactList = await Contact.find();
                await writeToExcel(contactList,ctx)
            }
        }
        // await writeToExcel(excelContact);
        return;
    }
    return; 
}
