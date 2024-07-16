const {createServer} = require("http");
const app = require("./app");
const {Server} = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000', // 허용할 클라이언트의 주소 (React 앱이 실행 중인 주소)
    }
});

require("./utils/io")(io);

httpServer.listen(process.env.PORT, () => {
    console.log("server listening on port", process.env.PORT);
});