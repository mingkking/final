// import {io} from "socket.io-client";
const { io } = require("socket.io-client");
const socket = io("http://localhost:5001");

module.exports = socket;