#include <Arduino.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);  // RX, TX 핀 설정 (지문 센서와 연결)
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

void setup() {
    Serial.begin(9600);
    mySerial.begin(57600);

    if (finger.verifyPassword()) {
        Serial.println("지문 센서가 연결되었습니다!");
    } else {
        Serial.println("지문 센서를 찾을 수 없습니다 :(");
        while (1);
    }
}

void loop() {
    if (Serial.available()) {
        char command = Serial.read();
        if (command == 'R') {  // 지문 등록 명령 수신
            registerFingerprint();
        }
    }

    // 지문 인식 확인
    if (fingerprintRecognized()) {
        Serial.println("등록된 지문이 인식되었습니다!");  // 지문 인식 시 메시지 전송
    }
}

// 지문 등록 함수
void registerFingerprint() {
    Serial.println("지문등록을 시작합니다.");
    delay(1000);

    Serial.println("지문을 인식해주세요.");
    while (finger.getImage() != FINGERPRINT_OK);
    delay(500);

    Serial.println("지문을 떼주세요.");
    delay(1000);

    Serial.println("다시한번 인식해주세요.");
    while (finger.getImage() != FINGERPRINT_OK);
    delay(500);

    int fingerprintID = 1;  // 예시 ID
    if (finger.storeModel(fingerprintID) == FINGERPRINT_OK) {
        Serial.print("등록 완료! ID: ");
        Serial.println(fingerprintID);
    } else {
        Serial.println("지문 등록 실패");
    }
}

// 지문 인식 함수
bool fingerprintRecognized() {
    if (finger.getImage() == FINGERPRINT_OK && finger.image2Tz() == FINGERPRINT_OK) {
        if (finger.fingerFastSearch() == FINGERPRINT_OK) {
            return true;  // 등록된 지문 인식
        }
    }
    return false;
}
