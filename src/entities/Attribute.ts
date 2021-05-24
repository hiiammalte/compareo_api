import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Types } from 'mongoose'

import ComparisionType from "../enums/ComparisionType";
import { IEntity } from "./IEntity";
import { User } from "./User";


@ObjectType({ description: "The reusable Attribute model - used as base for assigning properties to products" })
class Attribute implements IEntity {

    @Field(()=> ID)
    readonly id!: Types.ObjectId;
  
    @Field({ description: 'Attribute name' })
    @prop({ required: true, type: String })
    public title!: string;

    @Field({ description: 'Attribute type' })
    @prop({ required: true, enum: ComparisionType })
    public dataType!: ComparisionType;
    
    @Field(_type => User, { description: 'User who created this attribute' })
    @prop({ required: true, autopopulate: true, ref: () => User })
    public creator!: Ref<User>;

    @Field({ description: 'Attribute creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'Attribute last update date', nullable: true })
    public updatedAt?: Date;
}

const AttributeModel = getModelForClass(Attribute, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { Attribute, AttributeModel }