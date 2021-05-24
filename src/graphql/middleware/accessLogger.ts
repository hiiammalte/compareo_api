import { MiddlewareFn } from "type-graphql";

import AppContext from "../authorization/appContext";

const AccessLogger: MiddlewareFn<AppContext> = ({ context , info } , next) => {
    const userId: string = context?.user?.userId || "guest";
    console.log(`Logging access: ${userId} -> ${info.parentType.name}.${info.fieldName}`);
    return next();
};

export default AccessLogger;