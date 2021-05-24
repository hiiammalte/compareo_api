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
    }).then(
        () => { isConnected = true },
        err => { throw new Error(err) }
    );

    mongoose.connection.on('error', err => {
        throw new Error(err);
    });
};

export default connectToDB;