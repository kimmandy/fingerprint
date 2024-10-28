const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

const arduinoPort = new SerialPort({ path: "COM5", baudRate: 9600 }); // COM5로 설정
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\n" }));

// 출입 기록 배열
const accessLogs = [];

// 정적 파일 제공 설정
app.use(express.static("public"));

// 기본 경로에서 로그인 페이지로 리디렉션
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// 회원가입 요청 (예시 - 서버에 사용자 등록 추가 가능)
app.post("/signup", (req, res) => {
    // 회원가입 요청 처리 로직 추가 (예: 데이터베이스 또는 메모리 저장)
    res.json({ success: true, message: "회원가입 성공!" });
});

// 로그인 요청 처리 (예시 - 로그인 인증 로직 추가 가능)
app.post("/login", (req, res) => {
    // 로그인 요청 처리 로직 추가 (예: 데이터베이스 확인)
    res.json({ success: true, message: "로그인 성공!" });
});

// 클라이언트 연결 시 출입 기록 전송
io.on("connection", (socket) => {
    socket.on("registerCommand", (command) => {
        arduinoPort.write(command);
    });

    // 접속한 클라이언트에게 출입 기록 전달
    socket.emit("accessLog", accessLogs);
});

// 아두이노에서 데이터 수신 시
parser.on("data", (data) => {
    const trimmedData = data.trim();

    if (trimmedData === "등록된 지문이 인식되었습니다!") {
        const timestamp = new Date().toLocaleString();
        const logEntry = `등록된 지문이 인식되었습니다! (${timestamp})`;
        accessLogs.push(logEntry);
        io.emit("accessLog", accessLogs);  // 모든 클라이언트에 출입 기록 전송
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
