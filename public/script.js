const socket = io();

// 지문 등록 요청 전송 및 상태 메시지 표시
function registerFingerprint() {
    document.getElementById("serialOutput").textContent = "지문 등록을 시작합니다. 잠시만 기다려 주세요.";
    socket.emit("registerCommand", "R");
}

// 메뉴 전환 함수
function showContent(tab) {
    document.querySelectorAll(".content").forEach(content => content.style.display = "none");
    document.getElementById(tab).style.display = "block";
    document.querySelectorAll(".navbar button").forEach(btn => btn.classList.remove("active"));
    document.getElementById(tab + "Btn").classList.add("active");
}

// 페이지 로드 시 기본 메뉴 설정
document.addEventListener("DOMContentLoaded", () => {
    showContent('register');
});

// 서버로부터 출입 기록 수신
socket.on("accessLog", (logs) => {
    const logDiv = document.getElementById("accessLog");
    logDiv.innerHTML = "";
    logs.forEach(log => {
        const entry = document.createElement("div");
        entry.classList.add("serial-entry");
        entry.textContent = log;
        logDiv.appendChild(entry);
    });
});
