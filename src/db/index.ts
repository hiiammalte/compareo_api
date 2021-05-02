import mongoose from "mongoose";
import { mongo } from "../config/environment/index"

let isConnected : boolean;
let db : any;

const connectToDB = async () => {
    if (isConnected) return db;

    db = await mongoose.connect(`${mongo.url}`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }, () => {
        isConnected = true;
    });

    mongoose.connection.on('error', err => {
        throw new Error(err);
    });
};

export default connectToDB;