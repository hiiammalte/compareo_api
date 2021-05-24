import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

import ComparisionType from "../../../enums/ComparisionType";
import { Attribute } from "../../../entities/Attribute";

@InputType()
class CreateAttributeInput implements Partial<Attribute> {

    @Field()
    @Length(1, 255)
    public title!: string;
    
    @Field(() => ComparisionType)
    public dataType!: ComparisionType;
}

@InputType()
class UpdateAttributeInput implements Partial<Attribute> {

    @Field({ nullable: true })
    @Length(1, 255)
    public title?: string;

    @Field(() => ComparisionType, { nullable: true })
    public dataType?: ComparisionType;
}

export { CreateAttributeInput, UpdateAttributeInput }