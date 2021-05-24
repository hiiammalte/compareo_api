import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Types } from 'mongoose'

import { IEntity } from "./IEntity";

@ObjectType({ description: "The Category model - used for categorizing projects" })
class Category implements IEntity {

    @Field(()=> ID)
    readonly id!: Types.ObjectId;
  
    @Field({ description: 'Category name' })
    @prop({ required: true, type: String })
    public title!: string;


    @Field({ description: 'Category creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'Category last update date', nullable: true })
    public updatedAt?: Date;
}

const CategoryModel = getModelForClass(Category, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { Category, CategoryModel }