import { getObjectId } from "mongo-seeding";
import { Category } from "../../../../entities/Category";

const names: string[] = ["Insurances", "Software", "Cars", "Games"]

function mapToCategory(names: string[]): Category[] {
    return names.map((name: string): Category => {
      const id = getObjectId(name);
  
      return {
        id,
        title: name,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
};

const categories: Category[] = mapToCategory(names);
export = categories;
