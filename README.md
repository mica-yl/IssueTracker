# IssueTracker 
 Project is a practice from [Pro MERN](https://www.oreilly.com/library/view/pro-mern-stack/9781484243916/).

## how to run
1. install dependencies:

    `npm i -g pnpm`

    `pnpm i`

2. start and populate database:

  * run a Mongo database.
  * populate data : 
    * `mongosh generate-random.mongo.js`
    * or `mongosh --host {Host} --port {PORT} --file generate-random.mongo.js`

3. run:

    * In memory:

      * run: `pnpm dev:all-hook` and open browser on : `localhost:8082`

      * or `pnpm start:hook` and in other terminal `pnpm start:client-server` and view on `localhost:8082`


    * In file system: 

      1. build: `pnpm build`
    
      2. run: `pnpm start`

      3. open `localhost:8081`


## client side

 ### API

 ### App
 
 ### Dynamic Router 

 ### Toast

 ### utils

## server side

### Rest API



### Server-Side Rendering 

node stream