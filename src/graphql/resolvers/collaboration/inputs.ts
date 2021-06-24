import { InputType, Field } from "type-graphql";
import { IsEmail } from "class-validator";
import { User } from "../../../entities/User";

@InputType()
class AddCollaboratorInput  implements Partial<User> {

    @Field(() => String!, { nullable: false })
    @IsEmail()
    public email!: string;
}

@InputType()
class RemoveCollaboratorInput {

    @Field(() => String)
    public id!: string;
}


export { AddCollaboratorInput, RemoveCollaboratorInput }