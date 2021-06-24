import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from "type-graphql";
import { Types } from 'mongoose';

import { IEntity } from "./IEntity";


@ObjectType({ description: "The User model" })
class User implements IEntity {

    @Field(()=> ID)
    readonly id!: Types.ObjectId;
  
    @Field({ description: 'User name' })
    @prop({ required: true, type: String })
    public username!: string;

    @Field({ description: 'User email - also to be used for login' })
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

    //for registration via invite
    @prop({ type: String })
    public invitationCode?: string

    //for authentication via refreshToken
    @prop({ type: Number})
    public tokenCount!: number

    @Field({ description: 'User creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'User last update date', nullable: true })
    public updatedAt?: Date;
}

const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { User, UserModel }