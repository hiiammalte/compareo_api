import { Types } from 'mongoose';

import { IEntity } from '../entities/IEntity';


interface IAccessToken {
  iat: number,
  exp: number,
  payload: IAccessTokenPayload
}

interface IAccessTokenPayload {
  userId: string;
  username: string;
  roles: string[];
}

interface IRefreshToken {
  iat: number,
  exp: number,
  payload: IRefreshTokenPayload
}

interface IRefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

interface IUser extends IEntity{
  _id: Types.ObjectId;
  tokenCount: number;
  username: string;
}
  
export { IAccessToken, IAccessTokenPayload, IRefreshToken, IRefreshTokenPayload, IUser }