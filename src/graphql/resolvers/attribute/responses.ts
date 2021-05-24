import { Field, ObjectType } from "type-graphql";

import { Attribute } from "../../../entities/Attribute";
import MutationResponse from "../../common/MutationResponse"

@ObjectType({ implements: MutationResponse })
class AttributeCreatedResponse extends MutationResponse {
    
    @Field(() => Attribute, {nullable: true})
    attribute?: Attribute
}

@ObjectType({ implements: MutationResponse })
class AttributeUpdatedResponse extends MutationResponse {
    
    @Field(() => Attribute, {nullable: true})
    attribute?: Attribute
}

@ObjectType({ implements: MutationResponse })
class AttributeSuccessResponse extends MutationResponse {
    
    @Field(() => Boolean, {nullable: true})
    success?: Boolean
}

export { AttributeCreatedResponse, AttributeUpdatedResponse, AttributeSuccessResponse };