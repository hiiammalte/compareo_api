import { Request, Response } from "express";
import { IAccessTokenPayload } from "../../authentication/tokenDefs";

interface AppContext {
  req: Request;
  res: Response;
  user?: IAccessTokenPayload;
}

export default AppContext;