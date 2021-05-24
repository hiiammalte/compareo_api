import { sign } from "jsonwebtoken";

import { IAccessTokenPayload, IRefreshTokenPayload, IUser } from "./tokenDefs";
import { accessTokenSecret, resetTokenSecret } from "../config/environment";


function setAccessToken(user : IUser) {

  const accessTokenPayload: IAccessTokenPayload = {
    userId: user._id.toHexString(),
    username: user.username,
    roles: []
  };

  const accessToken : string = sign(
    { payload: accessTokenPayload },
    accessTokenSecret!,
    { expiresIn: '15m' }
  );

  return { accessToken };
}

function setRefreshToken(user : IUser, longlife: boolean) {

  const refreshTokenPayload : IRefreshTokenPayload = {
    userId: user?._id?.toHexString(),
    tokenVersion: user.tokenCount
  };

  const refreshToken : string = sign(
    { payload: refreshTokenPayload },
    resetTokenSecret!,
    { expiresIn: longlife ? '30d' : '12h' }
  );

  return { refreshToken };
}

export { setAccessToken, setRefreshToken };