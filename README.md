# How to run it

## Install node
First, you need to have node installed. You can use a node version manager like [n](https://github.com/tj/n#installation).

## Install dependencies
Then, you need to install the dependencies for the project:
```shell
npm install
```

## Build the app
To run the server using node, you need to transpile .ts file to .js:
```shell
npm run build
```

## Run the server
Finally, you can run the server:
```shell
npm run start
```
By default, the server will run on the port `3000`. You can override it by setting the `SERVER_PORT` environnement variable:
```shell
SERVER_PORT=4242 npm run start
```

# QUESTIONS

## Question about big tables
If for any reasons, I would have to deal with much more data:

- I would make a database repository, using PGSQL for example to get better performances on big tables.
- I would have to paginate the results to ensure queries don't exceed a confortable amount of time.
- If there were to be a high rate of request per second, I would cluster this app using PM2 for example to improve the server speed rate.
- I could also use a cache system to get faster results without consuming a lot of resources.

## Questions about risks

The cache system might not be accurate. To mitigate this, I should implement an update system which will check when the data is updated and expire the cache linked to it.

## Questions about monitoring

Well, first, using a database needs more attention than a "InMemory" persistence.
I would have to monitor that the computer hosting the database don't run out of space and is powerful enough for the acceptable delay.

Much like the database, an app can crash as well because of an edge case. I would have to add a logger to be able to solve the bugs as quickly as possible.

