import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Types } from 'mongoose';

import { IEntity } from "./IEntity";
import { Property } from "./Property";
import { User } from "./User";

@ObjectType({ description: "The Product model - used for comparision within projects" })
class Product implements IEntity {

    @Field(()=> ID)
    readonly id!: Types.ObjectId;
    
    @Field({ description: 'Name of the product' })
    @prop({ required: true, type: String })
    public name!: string;
    
    @Field({ description: 'Url of website with information on the product', nullable: true })
    @prop({ type: String })
    public url?: string;

    @Field({ description: 'Name of person or organization that invented/manufactures the product', nullable: true })
    @prop({ type: String })
    public manufacturer?: string;
      
    @Field(_type => [Property], { description: 'Comparable properties of product' })
    @prop({ type: () => Property })
    public properties?: Property[];

    
    @Field(_type => User, { description: 'User who created this object' })
    @prop({ required: true, autopopulate: true, ref: () => User })
    public creator!: Ref<User>;

    @Field({ description: 'Object creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'Object last update date', nullable: true })
    public updatedAt?: Date;
}

const ProductModel = getModelForClass(Product, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { Product, ProductModel }