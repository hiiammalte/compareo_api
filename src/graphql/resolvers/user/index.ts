import { Arg, Ctx, Mutation, Resolver, Query, Authorized,  } from "type-graphql";
import { ObjectId } from "mongodb";
import argon2 from "argon2";

import { UserModel, User } from "../../../entities/User";
import { UserSuccessResponse, UserTokenResponse } from "./responses";
import { RegistrationInput, RegistrationByInvitationInput, UsernamePasswordInput } from "./inputs";

import AppContext from "../../authorization/appContext";
import { setAccessToken, setRefreshToken } from "../../../authentication/setTokens";

const LONGLIFE_ACCESSTOKEN_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days
const REGULAR_ACCESSTOKEN_AGE = 1000 * 60 * 60 * 12 // 12 hours

@Resolver()
export default class UserResolver {

    @Mutation(() => UserTokenResponse)
    async register(
        @Arg('options', () => RegistrationInput) options: RegistrationInput,
        @Ctx() { res }: AppContext
    ): Promise<UserTokenResponse> {

        const hashedPassword = await argon2.hash(options.password); 
        const user = await UserModel.create({
            username: options.username,
            password: hashedPassword,
            email: options.email,
            tokenCount: 0
        });
        if (!user) {
            return {
                errors: [{ message: "Internal server error" }]
            };
        }
        
        // creating new tokens
        const { accessToken } = setAccessToken(user);
        const { refreshToken } = setRefreshToken(user, false);

        // add refresh-token as cookie to response header
        res.cookie("compareo", refreshToken, {
            httpOnly: true,
            path: '/refreshAccess',
            expires: new Date(Date.now() + REGULAR_ACCESSTOKEN_AGE),
            sameSite: 'strict'
        });

        // returning access-token as string to client
        return { token: accessToken };
    }

    @Mutation(() => UserTokenResponse)
    async registerByInvitation(
        @Arg('options', () => RegistrationByInvitationInput) options: RegistrationByInvitationInput,
        @Ctx() { res }: AppContext
    ): Promise<UserTokenResponse> {

        let user = await UserModel.findOne({ $and: [{ email: options.email }, { invitationCode: options.invitationCode }] });
        if (!user) {
            return {
                errors: [{ message: "Invalid email or invitation code" }]
            }
        }
        
        const hashedPassword = await argon2.hash(options.password); 
        user.password = hashedPassword;
        user.username = options.username;
        user.save();

        // creating new tokens
        const { accessToken } = setAccessToken(user);
        const { refreshToken } = setRefreshToken(user, false);

        // add refresh-token as cookie to response header
        res.cookie("compareo", refreshToken, {
            httpOnly: true,
            path: '/refreshAccess',
            expires: new Date(Date.now() + REGULAR_ACCESSTOKEN_AGE),
            sameSite: 'strict'
        });

        // returning access-token as string to client
        return { token: accessToken };
    }

    @Mutation(() => UserTokenResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { res }: AppContext
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
        const { accessToken } = setAccessToken(user);
        const { refreshToken } = setRefreshToken(user, options.longlife);

        // add refresh-token as cookie to response header
        res.cookie("compareo", refreshToken, {
            httpOnly: true,
            path: '/refreshAccess',
            expires: new Date(Date.now() + (options.longlife ? LONGLIFE_ACCESSTOKEN_AGE : REGULAR_ACCESSTOKEN_AGE)),
            sameSite: 'strict'
        });

        // returning access-token as string to client
        return { token: accessToken };
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
        user.tokenCount++;
        await UserModel.findByIdAndUpdate({_id: userId}, user, {new: true});
        return { success: true }
    }

    @Authorized()
    @Mutation(() => UserSuccessResponse)
    async logout(
        @Ctx() ctx: AppContext
    ): Promise<UserSuccessResponse> {

        let currentUser = await UserModel.findOne({ _id: ctx.user?.userId });
        if (!currentUser) throw new Error("Internal server error");
        
        // incrementing tokenVersion to make current refresh-token invalid
        currentUser.tokenCount++;
        await UserModel.findByIdAndUpdate({_id: currentUser._id}, currentUser, {new: true});

        ctx.res.clearCookie("compareo");
        return { success: true }
    }
    
    @Authorized()
    @Mutation(() => UserSuccessResponse)
    async deleteUser(
        @Arg('id', () => String) id: ObjectId
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

        return await UserModel.find({});
    }

    @Authorized()
    @Query(() => User, { nullable: true })
    async user(
        @Arg("id", () => String) id: ObjectId
    ): Promise<User | null> {
        
        return await UserModel.findById({_id: id});
    }
}