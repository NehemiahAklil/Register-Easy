import { Context, Scenes } from 'telegraf'


export interface MyContext extends Context {
    // will be available under `ctx.myContextProp`
    myContextProp: string
  
    // declare session type
    session: MySession
    // declare scene type
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>
    // declare wizard type
    wizard: Scenes.WizardContextWizard<MyContext>
  }

export interface MySession extends Scenes.WizardSession {
    // will be available under `ctx.session.mySessionProp`
    contactInfo : ContactInfo;
}

export interface ContactInfo {
  fullName?: string;
  telephone?: string
}
export interface ExcelContact {
  firstName: string;
  lastName?: string;
  phoneNumber?: string
}