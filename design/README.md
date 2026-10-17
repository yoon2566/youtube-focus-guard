# 집중의 숲 — Stitch 디자인

Stitch 프로젝트: https://stitch.withgoogle.com/projects/6960462687788289405?pli=1

## 콘셉트

- `focus-forest-concept.png`: 원본 콘셉트 이미지
- `focus-forest-upload.png`: 브라우저 첨부 전송 크기에 맞춘 축소 사본 (640 × 427)
- 원본과 축소 사본은 같은 콘셉트이며 레이아웃을 변경하지 않았습니다.
- 축소 사본은 2026-10-17에 Chrome의 Stitch 입력창에 clipboard.png로 실제 첨부했습니다.

## 요청한 화면

1. 홈: 닉네임, 혼자 하기, 방 만들기, 초대코드로 참여
2. 시간 설정: 10·25·50분, 1분 체험, 목표 입력
3. 함께 대기방: 6자리 초대코드, 친구 준비, 전원 준비 후 시작
4. 집중 준비: 빗소리·숲소리·명상 음악, 음량, 화면 켜짐 유지 상태
5. 집중 중: 공동 나무, 타이머, 친구 상태
6. 이탈 일시정지: 한 명 이탈하면 전원 정지, 복귀 후 재개
7. 완료/숲: 전원 성공, 공동 나무와 보너스

혼자 기본 보상, 2명 1.2배, 3명 이상 1.5배. 중도 포기는 전체 도전 종료.

## 범위

이 폴더는 디자인 결과물입니다. 실시간 방 동기화, 타이머, 브라우저 화면 숨김 감지, 실제 오디오 및 Screen Wake Lock을 통합 검증한 운영 웹앱이 아닙니다.
웹은 다른 앱 실행 자체를 차단하지 못합니다. 화면 켜짐 유지 요청은 브라우저·기기 상태에 따라 해제되거나 지원되지 않을 수 있습니다.

## 현재 상태

7개 화면 생성과 다운로드 완료.

- `focus-forest-final/`: 최종 7화면 HTML + PNG + DESIGN.md
- `focus-forest-final/index.html`: 화면 모아보기 (별도 작성한 로컬 갤러리)
- `focus-forest-design.zip`: 최종 7화면 배포 묶음
- `stitch-full-export.zip`: 초안 4화면과 참고 이미지까지 포함한 Stitch 원본 ZIP
- `stitch-export/`: 원본 ZIP 압축 해제본
- `stitch-project-proof.png`: Chrome의 실제 생성 완료 화면

CLI 설치나 API 인증 없이, 사용자가 열어 둔 Chrome의 Stitch 웹 UI를 사용했습니다.
