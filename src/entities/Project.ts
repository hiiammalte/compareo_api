import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from "type-graphql";
import { IEntity } from './IEntity';
import { User } from './User';

@ObjectType({ description: "The Project model" })
class Project implements IEntity {
    @Field(()=> ID)
    readonly id!: string;

    @Field(_type => User)
    @prop({ required: true, ref: User })
    public creator: Ref<User>;

    @prop({ required: false, ref: User })
    public collaborators?: Ref<User>[];
  
    @Field()
    @prop({ required: true, type: String })
    public title!: string;
  
    @prop({ type: String })
    public desciption!: string;

    @Field({ description: 'Project creation date', nullable: true })
    public createdAt?: Date;
    
    @Field({ description: 'Project last update date', nullable: true })
    public updatedAt?: Date;
}

const ProjectModel = getModelForClass(Project, {
    schemaOptions: {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
    }
});

export { Project, ProjectModel }