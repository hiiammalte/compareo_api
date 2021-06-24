import { Resolver, Query, Authorized, Ctx, Mutation, Arg } from "type-graphql";
import { Types } from 'mongoose';

import AppContext from "../../../graphql/authorization/appContext";
import { Product, ProductModel } from "../../../entities/Product";
import { CreateProductInput, UpdateProductInput } from "./inputs";
import { ProductCreatedResponse, ProductSuccessResponse, ProductUpdatedResponse } from "./responses";
import { UserModel } from "../../../entities/User";
import { ProjectModel } from "../../../entities/Project";


@Resolver()
export default class ProductResolver {

    @Authorized()
    @Mutation(() => ProductCreatedResponse)
    async createProduct(
        @Ctx() ctx: AppContext,
        @Arg('projectId', () => String) projectId: Types.ObjectId,
        @Arg('options', () => CreateProductInput) options: CreateProductInput
    ): Promise<ProductCreatedResponse> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let parentProject = await ProjectModel.findById({ _id: projectId });
        if (!parentProject) {
            return {
                errors: [{ message: "Project not found" }]
            }
        }

        const product = new ProductModel({
            name: options.name,
            url: options.url,
            manufacturer: options.manufacturer,
            creator: currentUser
        });

        parentProject.products?.push(product);
        await parentProject.save();
        return { product };
    }

    @Authorized()
    @Query(() => [Product])
    async products(
        @Ctx() ctx: AppContext,
        @Arg('projectId', () => String) projectId: Types.ObjectId
    ): Promise<Product[]> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");
        
        const parentProject = await ProjectModel.findById({ _id: projectId });
        return parentProject?.products ?? [];
    }
    
    @Authorized()
    @Query(() => Product, { nullable: true })
    async product(
        @Ctx() ctx: AppContext,
        @Arg('id', () => String) id: Types.ObjectId,
        @Arg('projectId', () => String) projectId: Types.ObjectId
    ): Promise<Product | null> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        const parentProject = await ProjectModel.findById({ _id: projectId });
        return parentProject?.products?.find(x => x.id === id) ?? null;
    }

    @Authorized()
    @Mutation(() => ProductUpdatedResponse)
    async updateProduct(
        @Ctx() ctx: AppContext,
        @Arg("id", () => String) id: Types.ObjectId,
        @Arg('projectId', () => String) projectId: Types.ObjectId,
        @Arg('options', () => UpdateProductInput) options: UpdateProductInput
    ): Promise<ProductUpdatedResponse> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        const parentProject = await ProjectModel.find({}).findByIdAndMemberId(projectId, currentUser.id);
        if (!parentProject) {
            return {
                errors: [{ message: "Project not found" }]
            }
        }
        console.log("PARENT PROJECT", parentProject);
        const product = parentProject && parentProject?.products?.find(x => x.id === id);
        console.log("PRODUCT", product);
        if (!product) {
            return {
                errors: [{ message: "Product not found" }]
            }
        }

        Object.assign(product, options);
        await parentProject!.save();

        return { product };
    }

    @Authorized()
    @Mutation(() => ProductSuccessResponse)
    async deleteProject(
        @Arg('id', () => String) id: Types.ObjectId,
        @Arg('projectId', () => String) projectId: Types.ObjectId,
        @Ctx() ctx: AppContext
    ): Promise<ProductSuccessResponse> {
        
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let parentProject = await ProjectModel.find({}).findByIdAndMemberId(projectId, currentUser.id);
        if (!parentProject) {
            return {
                success: false,
                errors: [{ message: "Project not found" }]
            }
        }
        const product = parentProject && parentProject.products?.find(x => x.id === id);
        if (!product) {
            return {
                success: false,
                errors: [{ message: "Product not found" }]
            }
        }

        parentProject!.products = parentProject?.products?.filter(c => c.id !== product.id);
        await parentProject!.save();
        
        return {
            success: true
        }
    }

}