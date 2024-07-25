// import {io} from "socket.io-client";
const { io } = require("socket.io-client");
const socket = io("http://192.168.0.209:5001");

module.exports = socket;