import { AuthChecker } from "type-graphql";
import AppContext from "../authorization/appContext";

export const AuthenticationChecker: AuthChecker<AppContext> = ( { context }, roles) => {
  
  if (roles.length === 0) {
    return context.req.user !== undefined;
  }

  if (!context.req.user) {
    return false;
  }

  // if (user.roles.some(role => roles.includes(role))) {
  //   return true;
  // }
  return true;
};

export default AuthenticationChecker