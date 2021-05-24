import { Field, ObjectType } from "type-graphql";

import { Project } from "../../../entities/Project";
import MutationResponse from "../../common/MutationResponse"

@ObjectType({ implements: MutationResponse })
class ProjectCreatedResponse extends MutationResponse {
    
    @Field(() => Project, {nullable: true})
    project?: Project
}

@ObjectType({ implements: MutationResponse })
class ProjectUpdatedResponse extends MutationResponse {
    
    @Field(() => Project, {nullable: true})
    project?: Project
}

@ObjectType({ implements: MutationResponse })
class ProjectSuccessResponse extends MutationResponse {
    
    @Field(() => Boolean, {nullable: true})
    success?: Boolean
}

export { ProjectCreatedResponse, ProjectUpdatedResponse, ProjectSuccessResponse };