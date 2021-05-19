import mongoose from 'mongoose';
import models from './model';
import Dotenv from 'dotenv'
Dotenv.config();

const mongoUrl = process.env.MONGO_URL;
if(!mongoUrl){
  throw new Error('MONGO_URL must be provided')
}
console.log('Trying to connect to mongo url', mongoUrl);
const dbConfigs = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
  const db =  mongoose.connect(mongoUrl, dbConfigs);
  db.then(({ connections }) => {
    console.log(`Connected to ${connections[0].name}`);
  }).catch((err) => console.log(err));

export default models;
