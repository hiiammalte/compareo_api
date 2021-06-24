import { Resolver, Mutation, Authorized, Arg, Ctx } from "type-graphql";
import { Types } from 'mongoose';

import { CollaborationSuccessResponse } from "./responses";
import AppContext from "../../authorization/appContext";
import { UserModel } from "../../../entities/User";
import { ProjectModel } from "../../../entities/Project";
import { AddCollaboratorInput, RemoveCollaboratorInput } from "./inputs";

@Resolver()
export default class CollaborationResolver {

    @Authorized()
    @Mutation(() => CollaborationSuccessResponse)
    async addCollaborators(
        @Arg('projectId', () => String) projectId: Types.ObjectId,
        @Arg('options', () => AddCollaboratorInput) options: AddCollaboratorInput,
        @Ctx() ctx: AppContext
    ): Promise<CollaborationSuccessResponse> {
        
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let parentProject = await ProjectModel.find({}).findByIdAndCreatorId(projectId, currentUser.id);
        if (!parentProject) {
            return {
                success: false,
                errors: [{ message: "Project not found" }]
            }
        }

        const existingUser = await UserModel.findOne({ email: options.email });
        if (existingUser) {
            parentProject!.collaborators?.push(existingUser);
        } else {

            //TODO: proper invititationCode creation
            //TODO: porper default password and username creation / handling
            const newUser = await UserModel.create({
                email: options.email,
                password: "replaceme",
                username: "replaceme",
                tokenCount: 0,
                invitationCode: String(projectId)
            });
            if (!newUser) throw new Error("User cannot be created");
            
            //TODO: call messaging service to send invitation email
            parentProject!.collaborators?.push(newUser);
        }

        await parentProject.save();

        return {
            success: true
        }
    }

    @Authorized()
    @Mutation(() => CollaborationSuccessResponse)
    async removeCollaborator(
        @Arg('projectId', () => String) projectId: Types.ObjectId,
        @Arg('options', () => RemoveCollaboratorInput) options: RemoveCollaboratorInput,
        @Ctx() ctx: AppContext
    ): Promise<CollaborationSuccessResponse> {
        const currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");

        let parentProject = await ProjectModel.find({}).findByIdAndCreatorId(projectId, currentUser.id);
        if (!parentProject) {
            return {
                success: false,
                errors: [{ message: "Project not found" }]
            }
        }

        //TODO: Properly check if all users-to-be-removed are collaborating and respond accordingly
        parentProject.collaborators = [...parentProject!.collaborators!.filter(user => user !== Types.ObjectId(options.id))]
        parentProject.save();

        return {
            success: true
        }
    }
}