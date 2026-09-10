# GitHub Pages 배포 규칙

- 소스 작업과 커밋은 `main` 브랜치에서 진행한다.
- 실제 공개 페이지는 `gh-pages` 브랜치를 사용한다.
- `main`에 푸시하면 `.github/workflows/sync-gh-pages.yml`이 `gh-pages`를 자동 갱신한다.
- `app.html`의 CSS·JS 쿼리 버전은 화면 수정 배포 시 함께 올려 브라우저 캐시를 무효화한다.
- 배포 확인 시 `main`, `origin/main`, `origin/gh-pages`의 최신 커밋 관계와 공개 URL 응답을 함께 확인한다.
