import { Field, ObjectType, InterfaceType } from "type-graphql";

@InterfaceType()
class MutationResponse {

  @Field(() => [Error], {nullable: true})
  errors?: [Error]
}

@ObjectType()
class Error {
  @Field(() => String, {nullable: false})
  message!: String
}

export default MutationResponse;