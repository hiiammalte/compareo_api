import { Project } from "../../../entities/Project";
import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

@InputType()
class CreateProjectInput implements Partial<Project> {
    @Field()
    @Length(1, 255)
    public title!: string;
    @Field()
    public description!: string;
}

@InputType()
class UpdateProjectInput implements Partial<Project> {
    @Field()
    @Length(1, 255)
    public title!: string;
    @Field()
    public description!: string;
}

export { CreateProjectInput, UpdateProjectInput }