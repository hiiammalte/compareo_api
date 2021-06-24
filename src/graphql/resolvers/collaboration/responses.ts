import { Field, ObjectType } from "type-graphql";

import MutationResponse from "../../common/MutationResponse";



@ObjectType({ implements: MutationResponse })
class CollaborationSuccessResponse extends MutationResponse {
    
    @Field(() => Boolean, {nullable: true})
    success?: Boolean
}

export { CollaborationSuccessResponse };