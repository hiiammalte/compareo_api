import { Field, ObjectType } from "type-graphql";
import MutationResponse from "../../common/MutationResponse"

@ObjectType({ implements: MutationResponse })
class ProjectCreatedResponse extends MutationResponse {
    
    @Field(() => String, {nullable: true})
    id?: String
}

export { ProjectCreatedResponse };