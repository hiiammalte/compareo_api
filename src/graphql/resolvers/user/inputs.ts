import { User } from "../../../entities/User";
import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";

@InputType()
class RegistrationInput implements Partial<User> {
    @Field()
    @Length(1, 255)
    public username!: string;
    @Field()
    public password!: string;
    @Field()
    @IsEmail()
    public email!: string;
}

@InputType()
class UsernamePasswordInput implements Partial<User> {
    @Field()
    public password!: string;
    @Field()
    @IsEmail()
    public email!: string;
}

export { RegistrationInput, UsernamePasswordInput }