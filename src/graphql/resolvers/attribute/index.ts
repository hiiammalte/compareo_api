import { Resolver, Query, Authorized, Ctx, Arg, Mutation } from "type-graphql";
import { Types } from 'mongoose';

import AppContext from "../../../graphql/authorization/appContext";
import { Attribute, AttributeModel } from "../../../entities/Attribute";
import { UserModel } from "../../../entities/User";
import { AttributeCreatedResponse, AttributeSuccessResponse, AttributeUpdatedResponse } from "./responses";
import { CreateAttributeInput, UpdateAttributeInput } from "./inputs";

@Resolver()
export default class AttributeResolver {

    @Authorized()
    @Mutation(() => AttributeCreatedResponse)
    async createAttribute(
        @Ctx() ctx: AppContext,
        @Arg('options', () => CreateAttributeInput) options: CreateAttributeInput
    ): Promise<AttributeCreatedResponse> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let attribute = await AttributeModel.create({
            title: options.title,
            dataType: options.dataType,
            creator: currentUser._id
        });
        if (!attribute) throw new Error("Internal server error");

        return { attribute };
    }

    @Authorized()
    @Query(() => [Attribute])
    async attributes(
        @Ctx() ctx: AppContext
    ): Promise<Attribute[]> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");
        

        return await AttributeModel.find({});
    }

    
    @Authorized()
    @Query(() => Attribute, { nullable: true })
    async attribute(
        @Ctx() ctx: AppContext,
        @Arg('id', () => String) id: Types.ObjectId
    ): Promise<Attribute | null> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        return await AttributeModel.findById({ _id: id });
    }

    @Authorized()
    @Mutation(() => AttributeUpdatedResponse)
    async updateAttribute(
        @Ctx() ctx: AppContext,
        @Arg("id", () => String) id: Types.ObjectId, 
        @Arg('options', () => UpdateAttributeInput) options: UpdateAttributeInput
    ): Promise<AttributeUpdatedResponse> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let attribute = await AttributeModel.findOne({ _id: id });
        if (attribute &&  attribute.creator === currentUser.id) {

            Object.assign(attribute, options);
            await attribute.save();

            return { attribute };
        }

        return {
            errors: [{ message: "Project not found" }]
        }
    }

    @Authorized()
    @Mutation(() => AttributeSuccessResponse)
    async deleteAttribute(
        @Arg('id', () => String) id: Types.ObjectId,
        @Ctx() ctx: AppContext
    ): Promise<AttributeSuccessResponse> {

        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        const attribute = await AttributeModel.find({}).findByIdAndCreatorId(id, currentUser.id);
        if (!attribute) {
            return {
                errors: [{ message: "Attribute not found" }]
            }
        } else {
            const deleted = await AttributeModel.deleteOne(attribute);
            if (deleted?.ok) {
                return { success: true }
            }
            
            throw new Error("Internal server error");
        }
    }
}