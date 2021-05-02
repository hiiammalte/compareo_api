import { sign } from "jsonwebtoken";
import { IAccessTokenPayload, IRefreshTokenPayload } from "./tokenDefs";
import { accessTokenSecret, resetTokenSecret } from "../config/environment";
import { IUser } from "../entities/User";

function setTokens(user : IUser) {
  
  const accessTokenPayload: IAccessTokenPayload = {
    userId: user.id,
    username: user.username,
    roles: []
  };

  const accessToken : string = sign(
    { payload: accessTokenPayload },
    accessTokenSecret!,
    { expiresIn: '15m' }
  );

  const refreshTokenPayload : IRefreshTokenPayload = {
    userId: user.id,
    tokenVersion: user.tokenCount
  };

  const refreshToken : string = sign(
    { payload: refreshTokenPayload },
    resetTokenSecret!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export { setTokens };