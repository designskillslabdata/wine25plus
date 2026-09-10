# WINE25+ PLUS UI 규칙

## 탑 앱바

새 화면은 아래 규칙을 기본으로 사용한다.

- 높이: `52px`
- 좌우 여백: `10px`
- 버튼 터치 영역: `40 × 40px`
- 기본 아이콘 크기: `20px`
- 제목: 화면 정중앙, `17px / 700`
- 왼쪽: 뒤로가기 버튼 하나
- 오른쪽: 화면에 필요한 기능 버튼 뒤에 홈 버튼을 배치
- 공유 버튼은 공유 기능이 있는 화면에서만 표시
- 설정 버튼은 실제 설정 진입점에서만 표시
- `X` 아이콘은 팝업·모달을 닫을 때만 사용하고 화면 이탈에는 사용하지 않음

## 공통 자산

- 뒤로가기: `assets/ui/back.svg`
- 홈: `assets/ui/home.svg`
- 설정: `assets/ui/settings.svg`
- 공유: `assets/ui/share.svg`

## 구현 방법

- 일반 화면은 `.flow-subheader`, `.flow-header-button`, `.flow-header-back`, `.flow-header-actions`, `.flow-header-share`, `.flow-header-exit`을 재사용한다.
- 계정·DRINK ID·공동 장바구니의 기존 헤더도 동일한 CSS 토큰을 공유한다.
- 전체 화면 이미지 위의 버튼도 투명 클릭 영역으로만 두지 않고, 공통 아이콘을 실제 DOM 버튼으로 표시한다.
- 아이콘을 전체 화면 이미지에 새로 합성하지 않는다. 그래야 이후 디자인 변경에도 위치와 기능을 공통으로 유지할 수 있다.
