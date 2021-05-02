import { Request, Response } from "express"
import { validateAccessToken, validateRefreshToken } from "./validateTokens";
import { UserModel, User } from "../entities/User";
import { DocumentType } from "@typegoose/typegoose";

const tokenValidationMiddleware = async function (req: Request, res: Response, next: any) : Promise<any> {
    const accessToken: string | null = req.headers?.authorization as string;
    const refreshToken: string | null = req.cookies["compareo"] as string;
    
    if (!accessToken && !refreshToken) return next();
  
    if (accessToken) {
      // Access-token should be formatted as "Bearer ..."
      const splitAccessToken: string[] = accessToken.split(" ");
      if (splitAccessToken && splitAccessToken.length > 1) {
        const decodedAccessTokenPayload = validateAccessToken(splitAccessToken[1]);
        if (decodedAccessTokenPayload) {
  
          // adding access-token-payload to context (contains user-id and user-roles)
          // will be available to all following operations down the line
          req.user = decodedAccessTokenPayload;
        }
      }
      return next();
    }
    
    if (refreshToken) {
      const decodedRefreshToken = validateRefreshToken(refreshToken!);
      let user: DocumentType<User> | null = null;
      let isValid: Boolean = false;

      if (decodedRefreshToken) {
        user = await UserModel.findOne({ userId: decodedRefreshToken.userId });
        if (user && user.tokenCount == decodedRefreshToken.tokenVersion) {
          isValid = true;
        }
      }

      //Requesting client to remove invalid refresh-token-cookie
      if (!decodedRefreshToken || !user || !isValid) {
        res.clearCookie("compareo");
      }
    }
    
    return next();
  }

export { tokenValidationMiddleware };