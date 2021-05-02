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
  
  export { IAccessToken, IAccessTokenPayload, IRefreshToken, IRefreshTokenPayload }