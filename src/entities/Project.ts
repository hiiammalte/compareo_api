import { prop, getModelForClass, Ref, plugin, queryMethod } from '@typegoose/typegoose';
import { AsQueryMethod, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { ObjectType, Field, ID } from "type-graphql";

import { IEntity } from './IEntity';
import { Category } from './Category';
import { User } from './User';
import { Product } from './Product';
import { Attribute } from './Attribute';


interface QueryHelpers {
    findByCreatorId: AsQueryMethod<typeof findByCreatorId>;
    findByIdAndCreatorId: AsQueryMethod<typeof findByIdAndCreatorId>;
    findByIdAndMemberId: AsQueryMethod<typeof findByIdAndMemberId>;
}

export function findByCreatorId(this: ReturnModelType<typeof Project, QueryHelpers>, creatorId: Types.ObjectId) {
    return this.find({}).populate({
        path: 'creator',
        match: { _id: new Types.ObjectId(creatorId) }
    });
}
export function findByIdAndCreatorId(this: ReturnModelType<typeof Project, QueryHelpers>, id: Types.ObjectId, creatorId: Types.ObjectId) {
    return this.findOne({ _id: id }).populate({
        path: 'creator',
        match: { _id: new Types.ObjectId(creatorId) }
    });
}
export function findByIdAndMemberId(this: ReturnModelType<typeof Project, QueryHelpers>, id: Types.ObjectId, userId: Types.ObjectId) {
    return this.findOne({ _id: id }).populate({
        path: 'creator collaborators',
        match: { $and: [{_id: new Types.ObjectId(userId)}, { $or: [{"creator": new Types.ObjectId(userId)}, {"collaborators.id": new Types.ObjectId(userId)}]}]  }
    });
}

@queryMethod(findByIdAndCreatorId)
@queryMethod(findByCreatorId)
@queryMethod(findByIdAndMemberId)
@plugin(autopopulate as any)
@ObjectType({ description: "The Project model - holds everythings relevant to a comparision" })
class Project implements IEntity {
    
    @Field(()=> ID)
    readonly id!: Types.ObjectId;
  
    @Field({ description: 'Project name' })
    @prop({ required: true, type: String })
    public title!: string;
  
    @Field({ description: 'Project description' })
    @prop({ type: String })
    public description!: string;

    @Field(_type => Category, { description: 'Category of the comparable products within this project' })
    @prop({ required: true, autopopulate: true, ref: () => Category })
    public category!: Ref<Category>;
    
    @Field(_type => [Product], { description: 'Comparable products within this project' })
    @prop({ required: false, autopopulate: true, type: () => Product })
    public products?: Product[];

    @Field(_type => [Attribute], { description: 'Attributes for comparison within this project'})
    @prop({ required: false, autopopulate: true, type: () => Attribute })
    public attributes?: Attribute[];

    @Field(_type => [User], { description: 'Additional users participating in this project' })
    @prop({ required: false, autopopulate: true, type: () => User })
    public collaborators?: Ref<User>[];


    @Field(_type => User, { description: 'User who created this project' })
    @prop({ required: true, autopopulate: true, ref: () => User })
    public creator!: Ref<User>;

    @Field({ description: 'Project creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'Project last update date', nullable: true })
    public updatedAt?: Date;
}

const ProjectModel = getModelForClass<typeof Project, QueryHelpers>(Project, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
});

export { Project, ProjectModel }