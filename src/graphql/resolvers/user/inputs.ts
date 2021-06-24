import { InputType, Field } from "type-graphql";
import { Length, IsEmail, IsBoolean } from "class-validator";
import { User } from "../../../entities/User";

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
class RegistrationByInvitationInput implements Partial<User> {

    @Field()
    @Length(1, 255)
    public username!: string;

    @Field()
    public password!: string;
    
    @Field()
    @IsEmail()
    public email!: string;

    @Field()
    public invitationCode!: string;
}

@InputType()
class UsernamePasswordInput implements Partial<User> {

    @Field()
    public password!: string;

    @Field()
    @IsEmail()
    public email!: string;

    @Field()
    @IsBoolean()
    public longlife!: boolean;
}

export { RegistrationInput, RegistrationByInvitationInput, UsernamePasswordInput }