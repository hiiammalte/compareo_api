import { MiddlewareFn } from "type-graphql";
import AppContext from "../authorization/appContext";

const ErrorInterceptor: MiddlewareFn<AppContext> = async ({ context, info }, next) => {
    try {
      return await next();
    } catch (err) {
      console.log(err, context, info);
      throw err;
    }
};

export default ErrorInterceptor;