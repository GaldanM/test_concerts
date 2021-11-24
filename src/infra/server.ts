import express from "express";

import concertController from "./concert.controller";

const server = express();
server.use(express.urlencoded({ extended: false }));

server.get("/concerts", concertController);

export default server;
