## About this app

This is a API to recipes, made with GraphQL, TypeOrm and with a BD from MySQL.

## Available Scripts

### `npm start`

Runs the api by default on port 3000 and with route to graphql on /graphql.

### `npm run build`

You should run this command after making any changes to the server or database configuration and before deploying the server.

### `npm run dev`

This command runs the development server with ts-node.

## Learn more

If you want to use another database, you need making change in the typeorm config on the following route `src/config/typeorm.ts` and later install the package for the database in your choose with npm install.

```
type: 'mysql', //type of DB of your choose
host: 'localhost', //host of your DB
port: 3306, //port
username: 'root', //username of your DB
password: '', //password 
database: 'recipesapi', //name of the DB to use
```

