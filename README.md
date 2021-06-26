# compareo API - Node.js, Express and GraphQL-based

This is the backend part of the compare[] app. The app lets you compare all kind of products against each other. You may also collaborate in teams.

This project supplies a GraphQL API endpoint and uses MongoDB for persistance. The app is build upon Node.js, Express and is written in TypeScript. There is heavy usage of TypeScript decorators within the code, which - in my opinion - make it both easier to code and easier to read. 

Basic authentication is configured using Access and Refresh Tokens. Before being able to run certain queries/mutation, a user is required to register, login and then provide the obtained Bearer Token (JWT) for authentication and authorization.

## Features

- Node.js and Express based Web API application
- GraphQL-endpoint using Apollo Server
- JWT-based Authentication
- Refresh Token as HttpOnly Cookie
- Access-logging and Error-intercepting Apollo-Middleware
- TypeGraphQL implementation
- TypeScript decorators

## What's included?
Overview of files and folders within the "src" folder of this project. Each subfolder holds additional files. The "app.ts" file is the executable entry point of this application.


    .src
    ├── authentication          # JWT definition, functions & middleware
    ├── config
    │   └── environment         # TypeScript configuration for environment variables
    ├── db                      # database communication configuration via mongoose
    │   └── seeding             # mongo-seeding configuration & demo data setup
    │       └── 1-categories
    ├── entities                # entities with TypeScript decorators for mongoose and GraphQL
    ├── enums                   # enums with GraphQL configuration for usage within entities
    ├── graphql
    │   ├── authorization       # interface for Apollo GraphQL context with current user object
    │   ├── common              # shared interface for GraphQL mutation response objects
    │   ├── middleware          # TypeGrapQL middleware functions
    │   └── resolvers           # GraphQL resolvers for entities
    │       ├── attribute
    │       ├── category
    │       ├── collaborators
    │       ├── product
    │       ├── project
    │       └── user
    ├── app.ts                  # app file including Apollo Server setup & Refresh Token endpoint
    └── env.d.ts                # TypeScript configuration file for gen-env script 

## Getting started

To get this project up and running, follow these steps:

### Prerequisites

- Node.js 14.17.0+
- IDE (preferably Visual Studio Code)
- MongoDB 4.4+ (local or in Docker Container)

### Setup

1. Clone this repository
2. At the root directory, install required packages by running:

```
npm install
```

3. Open `.env.example`-file within the root directory of this project, copy the content, create a new file in the same directory called `.env` and paste the content from your clipboard. Then enter the required information for your environment variables in this new file. These could be:

```
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/compareo
PORT=4000
ACCESS_TOKEN_SECRET=*your very secret first string*
RESET_TOKEN_SECRET=*your very secret second string*
CLIENT_URL=http://localhost:3000
```

4. That's it! To start the application, still at the root directory of this project, run:

```
npm run dev
```

5. Launch http://localhost:4000/graphql in your browser to visit the "GraphQL Playground" and to test your application (the port might be different, depending on your ".env"-file configuration).


### Customization

1. To seed the database with some basic data, at the root directory of this project, run:

```
npm run seed-db
```

2. Make sure to check out the following folder, if you're interested in what data is seeded (feel free to add your own data, of course):

```
/src/db/seeding/data
```

3. If you are adding additional environment variables, make sure to keep both ".env"- and ".env.example"-files in sync. Run the follwing command afterwards, in order to get typescript support on these new variables:

```
npm run gen-env
```


## Technologies

This project utilizes the following Technologies / Node Packages:
- Node.js
- GraphQL
- Express framework
- Apollo Server
- MongoDB
- TypeGraphQL
- typegoose
- mongoose
- argon2
- dotenv-safe
- mongo-seeding
