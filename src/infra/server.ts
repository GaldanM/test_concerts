import express from "express";

import concertController from "./concert.controller";

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get("/concerts", concertController);

export default server;
