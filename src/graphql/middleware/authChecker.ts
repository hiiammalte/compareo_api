import { AuthChecker } from "type-graphql";
import AppContext from "../authorization/appContext";

export const AuthenticationChecker: AuthChecker<AppContext> = ( { context }, roles) => {
  console.log("Hi from authorization-middlware. user: ", context.user);
  
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