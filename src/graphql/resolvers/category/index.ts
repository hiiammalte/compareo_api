import { Resolver, Query, Authorized } from "type-graphql";

import { Category, CategoryModel } from "../../../entities/Category";

@Resolver()
export default class CategoryResolver {

    @Authorized()
    @Query(() => [Category])
    async categories(): Promise<Category[]> {
        
        return await CategoryModel.find({});
    }
}