import { prop, getModelForClass } from '@typegoose/typegoose';
import { IEntity } from "./IEntity";
import { ObjectType, Field, ID } from "type-graphql";

interface IUser extends IEntity{
    tokenCount: number;
    username: string;
}

@ObjectType({ description: "The User model" })
class User implements IUser {
    @Field(()=> ID)
    readonly id!: string;
  
    @Field({ description: 'User name' })
    @prop({ required: true, type: String })
    public username!: string;

    @Field({ description: 'User email to be used on login' })
    @prop({
        required: true,
        lowercase: true,
        unique: true,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        type: String
    })
    public email!: string;
  
    @prop({ required: true, type: String })
    public password!: string;

    @Field({ description: 'User creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'User last update date', nullable: true })
    public updatedAt?: Date;

    //for authentication
    @prop({ type: Number})
    public tokenCount!: number
}

const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { IUser, User, UserModel }