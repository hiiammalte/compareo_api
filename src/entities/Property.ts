import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Types } from 'mongoose';

import ComparisionType from "../enums/ComparisionType";
import { Attribute } from "./Attribute";
import { User } from "./User";

@ObjectType({ description: "The Property model - used for assigning comparable values to products" })
class Property implements Attribute {

    @Field(()=> ID)
    readonly id!: Types.ObjectId;
  
    @Field({ description: 'Property name' })
    @prop({ required: true, type: String })
    public title!: string;

    @Field({ description: 'Property value' })
    @prop({ required: true, type: String })
    public value!: string;
    
    @Field({ description: 'Property type' })
    @prop({ required: true, enum: ComparisionType })
    public dataType!: ComparisionType;
    
    @Field(_type => User, { description: 'User who created this property' })
    @prop({ required: true, autopopulate: true, ref: () => User })
    public creator!: Ref<User>;

    @Field({ description: 'Property creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'Property last updated date', nullable: true })
    public updatedAt?: Date;
}

const PropertyModel = getModelForClass(Property, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { Property, PropertyModel }