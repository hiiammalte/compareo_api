import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

import { Product } from "../../../entities/Product";

@InputType()
class CreateProductInput implements Partial<Product> {
    
    @Field()
    @Length(1, 255)
    public name!: string;

    @Field({ nullable: true })
    public url?: string;

    @Field({ nullable: true })
    @Length(1, 255)
    public manufacturer?: string;
}

@InputType()
class UpdateProductInput implements Partial<Product> {
    
    @Field({ nullable: true })
    @Length(1, 255)
    public name?: string;

    @Field({ nullable: true })
    public url?: string;

    @Field({ nullable: true })
    @Length(1, 255)
    public manufacturer?: string;
}

export { CreateProductInput, UpdateProductInput }