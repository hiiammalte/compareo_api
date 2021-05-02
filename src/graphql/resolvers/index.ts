import UserResolver from "./user";
import ProjectResolver from "./project"

export const resolvers = [UserResolver, ProjectResolver ] as const;