import { verify } from "jsonwebtoken";
import { IAccessToken, IAccessTokenPayload, IRefreshToken, IRefreshTokenPayload } from "./tokenDefs";
import { accessTokenSecret, resetTokenSecret } from "../config/environment";

function validateAccessToken(token: string) : IAccessTokenPayload | null {
  try {
    if (!token) return null;
    
    const decoded = verify(token, accessTokenSecret!) as IAccessToken;
    return decoded.payload;
  } catch {
    return null;
  }
}

function validateRefreshToken(token: string) : IRefreshTokenPayload | null {
  try {
    if (!token) return null;
    
    const decoded = verify(token, resetTokenSecret!) as IRefreshToken;
    return decoded.payload;
  } catch {
    return null;
  }
}

export {validateAccessToken, validateRefreshToken};