import { Schema, model,Document } from 'mongoose';

export interface IContact extends Document{
    firstName:string;
    lastName:string;
    phoneNumber:string;
}
const contactSchema: Schema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phoneNumber:{
    type:String,
    trim:true
  }
});

export default model<IContact>('Contact', contactSchema);
