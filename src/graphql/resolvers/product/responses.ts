import { Field, ObjectType } from "type-graphql";

import { Product } from "../../../entities/Product";
import MutationResponse from "../../common/MutationResponse"

@ObjectType({ implements: MutationResponse })
class ProductCreatedResponse extends MutationResponse {
    
    @Field(() => Product, {nullable: true})
    product?: Product
}

@ObjectType({ implements: MutationResponse })
class ProductUpdatedResponse extends MutationResponse {
    
    @Field(() => Product, {nullable: true})
    product?: Product
}

@ObjectType({ implements: MutationResponse })
class ProductSuccessResponse extends MutationResponse {
    
    @Field(() => Boolean, {nullable: true})
    success?: Boolean
}

export { ProductCreatedResponse, ProductUpdatedResponse, ProductSuccessResponse };