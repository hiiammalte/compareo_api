import { Arg, Ctx, Mutation, Resolver, Query, Authorized,  } from "type-graphql";
import argon2 from "argon2";
import { ObjectId } from "mongodb";
import { UserModel, User } from "../../../entities/User";
import { UserCreatedResponse, UserSuccessResponse, UserTokenResponse } from "./responses";
import { RegistrationInput, UsernamePasswordInput } from "./inputs";
import AppContext from "../../authorization/appContext";
import { setTokens } from "../../../authentication/setTokens";
import { validateRefreshToken } from "../../../authentication/validateTokens";

@Resolver()
export default class UserResolver {

    @Mutation(() => UserCreatedResponse)
    async register(
        @Arg('options', () => RegistrationInput) options: RegistrationInput
    ): Promise<UserCreatedResponse> {
        const hashedPassword = await argon2.hash(options.password); 
        let user = await UserModel.create({
            username: options.username,
            password: hashedPassword,
            email: options.email,
            createdAt: new Date(),
            updatedAt: new Date(),
            tokenCount: 0
        });
        if (!user) {
            return {
                errors: [{ message: "Internal server error" }]
            };
        }

        return { id: user._id };
    }

    @Mutation(() => UserTokenResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() ctx: AppContext
    ): Promise<UserTokenResponse> {
        const user = await UserModel.findOne({email: options.email});
        if (!user) {
            return {
                errors: [{ message: "Invalid credentials" }]
            }
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{ message: "Invalid credentials" }]
            }
        }

        // creating new tokens
        const { accessToken, refreshToken } = setTokens(user);
        
        // add refresh-token as cookie to response header
        ctx.res.cookie("compareo", refreshToken, { httpOnly: true });

        // returning access-token as string to client
        return { token: accessToken ? `Bearer ${accessToken}` : null };
    }

    @Mutation(() => UserTokenResponse)
    async refreshAccess(
        @Ctx() ctx: AppContext
    ): Promise<UserTokenResponse> {

        // reading refresh-token from cookie
        const token = ctx.req.cookies["compareo"] as string;
        if (!token){
            return {
                errors: [{ message: "Refresh token not found" }]
            }
        }

        // validating refresh-token
        const decodedToken = validateRefreshToken(token);
        if (!decodedToken){
            return {
                errors: [{ message: "Invalid refresh token" }]
            }
        }

        // validating user and if access has not been revoked
        const user = await UserModel.findOne({ userId: decodedToken.userId });
        if (!user || user.tokenCount !== decodedToken.tokenVersion) {
            return {
                errors: [{ message: "Invalid refresh token" }]
            }
        }
            
        // creating new access-token
        const { accessToken } = setTokens(user);
        return { token: accessToken }
    }

    @Authorized()
    @Mutation(() => UserSuccessResponse)
    async revokeAccess(
        @Arg('userId', () => String) userId: String
    ): Promise<UserSuccessResponse> {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return {
                errors: [{ message: "User not found" }]
            }
        }

        // incrementing tokenVersion to make current refresh-token invalid
        user.tokenCount += 1;
        await UserModel.findByIdAndUpdate({_id: userId}, user, {new: true});
        return { success: true }
    }

    @Authorized()
    @Mutation(() => UserSuccessResponse)
    async logout(
        @Ctx() ctx: AppContext
    ): Promise<UserSuccessResponse> {
        ctx.res.clearCookie("compareo");
        return { success: true }
    }
    
    @Authorized()
    @Mutation(() => UserSuccessResponse)
    async deleteUser(
        @Arg('id', () => String) id: ObjectId,
    ): Promise<UserSuccessResponse> {
        const user = await UserModel.findByIdAndDelete({_id: id});
        if (!user) {
            return {
                errors: [{ message: "User not found" }]
            }
        } else {
            return { success: true }
        }
    }

    @Authorized()
    @Query(() => [User])
    async users(): Promise<User[]> {
        return await UserModel.find({})
    }

    @Authorized()
    @Query(() => User, { nullable: true })
    async user(
        @Arg("id", () => String) id: ObjectId
    ): Promise<User | null> {
        return await UserModel.findById({_id: id})
    }
}