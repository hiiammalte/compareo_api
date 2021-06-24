import { Arg, Mutation, Resolver, Query, Authorized, Ctx } from "type-graphql";
import { Types } from 'mongoose';

import { ProjectModel, Project } from "../../../entities/Project";
import { ProjectCreatedResponse, ProjectSuccessResponse, ProjectUpdatedResponse } from "./responses";
import { CreateProjectInput, UpdateProjectInput } from "./inputs";

import AppContext from "../../authorization/appContext";
import { UserModel } from "../../../entities/User";
import { CategoryModel } from "../../../entities/Category";


@Resolver()
export default class ProjectResolver {

    @Authorized()
    @Mutation(() => ProjectCreatedResponse)
    async createProject(
        @Ctx() ctx: AppContext,
        @Arg('options', () => CreateProjectInput) options: CreateProjectInput
    ): Promise<ProjectCreatedResponse> {
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");
        
        const category = await CategoryModel.findById({_id: options?.categoryId});
        if (!category) {
            return {
                errors: [{ message: "Category not found" }]
            };
        }

        let project = await ProjectModel.create({
            title: options.title,
            description: options.description,
            category: category._id,
            creator: currentUser._id
        });
        if (!project) throw new Error("Internal server error");

        return { project };
    }

    @Authorized()
    @Query(() => [Project])
    async projects(
        @Ctx() ctx: AppContext
    ): Promise<Project[]> {
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        return await ProjectModel.find({})
            .findByCreatorId(currentUser._id)
            .exec();
    }

    @Authorized()
    @Query(() => Project, { nullable: true })
    async project(
        @Ctx() ctx: AppContext,
        @Arg('id', () => String) id: Types.ObjectId
    ): Promise<Project | null> {
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        return await ProjectModel.findById({ _id: id });
    }

    @Authorized()
    @Mutation(() => ProjectUpdatedResponse)
    async updateProject(
        @Ctx() ctx: AppContext,
        @Arg("id", () => String) id: Types.ObjectId, 
        @Arg('options', () => UpdateProjectInput) options: UpdateProjectInput
    ): Promise<ProjectUpdatedResponse> {
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let project = await ProjectModel.findOne({ _id: id });
        if (project && (project.creator === currentUser.id || project.collaborators?.indexOf(currentUser.id) !== -1 )) {

            Object.assign(project, options);
            await project.save();

            return { project };
        }

        return {
            errors: [{ message: "Project not found" }]
        }
    }

    @Authorized()
    @Mutation(() => ProjectSuccessResponse)
    async deleteProject(
        @Arg('id', () => String) id: Types.ObjectId,
        @Ctx() ctx: AppContext
    ): Promise<ProjectSuccessResponse> {
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        const project = await ProjectModel.find({}).findByIdAndCreatorId(id, currentUser.id);
        if (!project) {
            return {
                errors: [{ message: "Project not found" }]
            }
        } else {
            const deleted = await ProjectModel.deleteOne(project);
            if (deleted?.ok) {
                return { success: true }
            }
            
            throw new Error("Internal server error");
        }
    }
}