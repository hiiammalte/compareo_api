require('ts-node').register();
import path from 'path';
import { Seeder } from 'mongo-seeding';
import { mongo } from "../../config/environment/index"

const config = {
  database: mongo.url,
  dropDatabase: false
};

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
    path.resolve('src/db/seeding/data'),
    {
        extensions: ['js', 'json', 'ts'],
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
    }
);

seeder
.import(collections)
.then(() => {
    console.log('Success');
})
.catch((err) => {
    console.log('Error', err);
});