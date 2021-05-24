import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

import { Project } from "../../../entities/Project";

@InputType()
class CreateProjectInput implements Partial<Project> {

    @Length(1, 255)
    @Field()
    public title!: string;

    @Field()
    public description!: string;

    @Field()
    public categoryId!: string;
}

@InputType()
class UpdateProjectInput implements Partial<Project> {
    
    @Length(1, 255)
    @Field({ nullable: true })
    public title?: string;

    @Field({ nullable: true })
    public description?: string;
    
    @Field({ nullable: true })
    public categoryId?: string
}

export { CreateProjectInput, UpdateProjectInput }