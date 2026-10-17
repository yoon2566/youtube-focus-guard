# 유튜브 집중 가드

유튜브 Android 앱을 실행하면 홈 화면으로 이동시키는 자기통제용 해커톤 MVP.

## 개발 상태

- 접근성 이벤트 기반 유튜브 감지 및 홈 이동 코드 구현
- 차단 ON/OFF, 권한 안내, 로컬 감지 기록 구현
- **APK 빌드 및 실기기 테스트: 진행 중. 아직 성공 확인 전입니다.**

## 설치 및 사용

Android 8.0 이상. Releases의 APK를 휴대폰에서 내려받아 설치합니다.
접근성 설정에서 **유튜브 집중 가드**를 허용하고 앱에서 **차단 ON으로 전환**을 누릅니다.
**유튜브 열어 테스트** 또는 홈 화면의 유튜브 아이콘으로 실행해 홈으로 돌아오는지 확인합니다.
**차단 OFF로 전환**하면 유튜브를 정상 이용할 수 있습니다.

APK 설치 후 접근성 권한이 제한되면 설정 → 앱 → 유튜브 집중 가드 → 메뉴의 **제한된 설정 허용**을 확인합니다. 제조사와 OS에 따라 다릅니다.

## 구현과 제한

- 대상 패키지: `com.google.android.youtube`만 정확히 일치할 때 처리
- `TYPE_WINDOW_STATE_CHANGED` → `performGlobalAction(GLOBAL_ACTION_HOME)`
- 기본 차단 OFF. ON/OFF 설정은 앱 재실행 후에도 유지
- 홈 요청 수락은 Android API 반환값이며 실제 화면 이동 성공을 독립적으로 증명하지는 않음
- 인터넷 권한, 화면 내용 조회 권한, 입력 내용 수집 없음
- 브라우저 유튜브, YouTube Music, PIP 및 백그라운드 재생 완전 차단은 지원하지 않음
- 접근성 해제, 앱 강제 종료/삭제 등에 대한 우회 방지는 지원하지 않음
- 재부팅 및 제조사 절전 정책에 따른 동작은 별도 검증 필요

## 빌드

JDK 17, Android SDK Platform 35, Build Tools 35.0.0, Gradle 8.13, AGP 8.9.2.
`ANDROID_HOME` 또는 git에서 제외된 `local.properties`의 `sdk.dir`로 SDK 위치를 지정합니다.

```powershell
.\gradlew.bat assembleDebug lintDebug
```

출력: `app/build/outputs/apk/debug/app-debug.apk` (개발용 서명 APK).
Gradle Wrapper는 환경 준비 후 추가됩니다.

## 실기기 확인 항목

- [ ] 설치 및 앱 실행
- [ ] 접근성 권한 허용
- [ ] OFF 상태에서 유튜브 정상 실행
- [ ] ON 상태에서 유튜브 실행 시 홈 이동 (3회 반복)
- [ ] OFF로 바꾼 뒤 정상 실행 복구
- [ ] 설정 앱과 다른 앱 정상 사용
- [ ] 가드 앱을 다시 열었을 때 ON/OFF 유지

USB 또는 같은 Wi-Fi의 무선 ADB가 없는 경우 사용자 수동 테스트 결과를 별도로 기록합니다.
기기 모델, Android 버전, 수행 항목과 관찰 결과가 없는 상태는 실기기 검증 완료로 표시하지 않습니다.
