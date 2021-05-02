import { User } from "../../../entities/User";
import { Field, ObjectType } from "type-graphql";
import MutationResponse from "../../common/MutationResponse"

@ObjectType({ implements: MutationResponse })
class UserCreatedResponse extends MutationResponse {
    
    @Field(() => String, {nullable: true})
    id?: String
}

@ObjectType({ implements: MutationResponse })
class UserUpdatedResponse extends MutationResponse {
    
    @Field(() => User, {nullable: true})
    user?: User;
}

@ObjectType({ implements: MutationResponse })
class UserSuccessResponse extends MutationResponse {
    
    @Field(() => Boolean, {nullable: true})
    success?: Boolean
}

@ObjectType({ implements: MutationResponse })
class UserTokenResponse extends MutationResponse {
    
    @Field(() => String, {nullable: true})
    token?: String | null
}


export { UserCreatedResponse, UserUpdatedResponse, UserSuccessResponse, UserTokenResponse };