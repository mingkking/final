const {createServer} = require("http");
const app = require("./app");
const {Server} = require("socket.io"); 
const cors = require("cors");          // 방화벽 관련
require("dotenv").config();            // .env 환경 설정

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://192.168.0.209:3000', // 허용할 클라이언트의 주소 (React 앱이 실행 중인 주소)
    }
});

require("./utils/io")(io); // utils/io.js 에서 리액트와 입/출력 통신

httpServer.listen(process.env.PORT, () => {
    console.log("server listening on port", process.env.PORT);
});