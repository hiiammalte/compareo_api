import { Arg, Mutation, Resolver, Query, Authorized, Ctx } from "type-graphql";
import { ProjectModel, Project } from "../../../entities/Project";
import { UserModel } from "../../../entities/User";
import { ProjectCreatedResponse } from "./responses";
import { CreateProjectInput } from "./inputs";
import AppContext from "../../authorization/appContext";

@Resolver()
export default class ProjectResolver {

    @Authorized()
    @Mutation(() => ProjectCreatedResponse)
    async createProject(
        @Ctx() ctx: AppContext,
        @Arg('options', () => CreateProjectInput) options: CreateProjectInput
    ): Promise<ProjectCreatedResponse> {
        console.log("PROJECT CREATE, USER: ", ctx.user);
        let currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser)
        {
            return {
                errors: [{ message: "Internal server error" }]
            };
        }
        let project = await ProjectModel.create({
            title: options.title,
            desciption: options.description,
            createdAt: new Date(),
            updatedAt: new Date(),
            creator: currentUser?._id
        });
        if (!project) {
            return {
                errors: [{ message: "Internal server error" }]
            };
        }

        return { id: project._id };
    }

    @Query(() => [Project])
    async projects(): Promise<Project[]> {
        return await ProjectModel.find({})
    }
}