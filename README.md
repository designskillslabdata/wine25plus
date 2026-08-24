# Figma frame 84 implementation

Figma file `bVhVO5l53OOGkMUv0yaYXe`, node `1:8381`을 구현한 독립형 모바일 웹 화면입니다.

## 실행

`index.html`을 브라우저에서 직접 열거나, 이 폴더에서 정적 서버를 실행하세요.

```sh
python3 -m http.server 4173
```

그다음 `http://localhost:4173`을 엽니다.

별도 패키지 설치나 빌드 과정은 필요하지 않습니다.

## GitHub Pages 반응형 시연 페이지

GitHub Pages 진입 파일인 `index.html`은 동일 앱을 다음과 같이 보여주는 반응형 래퍼 페이지입니다. 실제 모바일 앱 화면은 `app.html`에 있습니다.

- PC: 중앙 iPhone 목업 안에서 앱을 독립적으로 스크롤
- 우측: 모바일 접속용 QR 영역
- 모바일: 목업과 QR을 숨기고 앱을 화면 전체에 표시

QR은 실제 웹 주소로 게시하면 현재 GitHub Pages 주소를 자동 사용합니다. 별도의 모바일 URL을 사용하려면 `#w25-imweb-demo`의 `data-mobile-url`에 주소를 입력하세요.

## GitHub Pages 배포 구조

```text
figma-84-web/
├─ index.html       # PC 목업 + QR / 모바일 전체 화면 진입점
├─ app.html         # 실제 앱 화면
├─ styles.css       # 앱 스타일
├─ app.js           # 앱 인터랙션
└─ assets/          # Figma 이미지 및 SVG
```
