(() => {
  const presentation = document.getElementById('w25-presentation');
  if (!presentation || window.matchMedia('(max-width: 767px)').matches) return;

  const introPanel = presentation.querySelector('[data-presentation-panel="intro"]');
  const flowPanel = presentation.querySelector('[data-presentation-panel="flow"]');
  const introPhone = presentation.querySelector('.w25-present-phone');
  const introScreen = presentation.querySelector('.w25-present-screen');
  const introImage = presentation.querySelector('[data-intro-image]');
  const introApp = presentation.querySelector('[data-intro-app]');
  const introHotspot = presentation.querySelector('[data-intro-hotspot]');
  const introNext = presentation.querySelector('[data-intro-next]');
  const introKicker = presentation.querySelector('[data-intro-kicker]');
  const introTitle = presentation.querySelector('[data-intro-title]');
  const introDescription = presentation.querySelector('[data-intro-description]');
  const flowStage = presentation.querySelector('[data-flow-stage]');
  const flowPhone = presentation.querySelector('[data-flow-phone]');
  const flowApp = presentation.querySelector('[data-flow-app]');
  const ideaGrid = presentation.querySelector('.w25-idea-grid');
  const ideaCards = Array.from(presentation.querySelectorAll('[data-idea]'));
  const groupButtons = Array.from(presentation.querySelectorAll('[data-flow-group]'));
  const connector = presentation.querySelector('[data-flow-connector]');
  const connectorPath = presentation.querySelector('[data-flow-path]');
  const result = presentation.querySelector('[data-flow-result]');
  const resultImage = presentation.querySelector('[data-flow-result-image]');

  const appUrl = new URL('./app.html?v=20260831e', window.location.href);
  appUrl.searchParams.set('display', 'pc');
  appUrl.searchParams.set('presentation', '1');

  const introSteps = [
    {
      step: '01', label: 'APP ENTRY', kicker: '01 · APP ENTRY',
      title: '<span class="w25-intro-title-line">우리동네GS에서</span><span class="w25-intro-title-line">WINE25+PLUS를 만납니다</span>',
      description: '실제 사용자가 앱을 실행하는 순서대로<br />새로운 홈 화면까지 이동합니다.',
      button: '우리동네GS 열기', image: './assets/flow/phone-entry.png', alt: '아이폰 홈 화면의 우리동네GS 앱', className: 'is-phone-home',
    },
    {
      step: '02', label: 'LAUNCH', kicker: '02 · LAUNCH',
      title: '<span class="w25-intro-title-line">앱이 실행되고</span><span class="w25-intro-title-line">서비스로 진입합니다</span>',
      description: '발표에서는 실제 앱을 여는 순간처럼<br />짧은 스플래시 화면을 거칩니다.',
      button: '잠시 후 자동 이동', image: './assets/flow/splash.png', alt: '우리동네GS 앱 스플래시 화면', className: 'is-splash',
    },
    {
      step: '03', label: 'OUR GS', kicker: '03 · OUR GS',
      title: '<span class="w25-intro-title-line">우리동네GS 안에서</span><span class="w25-intro-title-line">WINE25+PLUS를 선택합니다</span>',
      description: '기존 서비스 홈의 WINE25+PLUS 타일이<br />학생 아이디어를 반영한 앱으로 연결됩니다.',
      button: 'WINE25+PLUS 들어가기', image: './assets/flow/our-gs.png', alt: '우리동네GS 홈의 WINE25+PLUS 타일', className: 'is-our-gs',
    },
    {
      step: '04', label: 'NEW HOME', kicker: '04 · NEW HOME',
      title: '<span class="w25-intro-title-line">7개의 아이디어가</span><span class="w25-intro-title-line">하나의 홈에 연결됩니다</span>',
      description: '이제 실제 홈 화면의 버튼과 배너가<br />어떤 학생 아이디어로 이어지는지 살펴봅니다.',
      button: '아이디어 연결 보기', image: '', alt: '새롭게 구성한 WINE25+PLUS 홈 화면', className: 'is-app',
    },
  ];

  const ideas = {
    cellar: {
      number: '01', title: '나만의 술장', group: 'utility', image: './assets/flow/cellar.png',
      description: '상단 프로필 아이콘에서 보유 주류와 취향 기록을 관리하는 나만의 술장으로 이동합니다.',
      point: [0.91, 0.105],
    },
    'shared-cart': {
      number: '02', title: '공동 장바구니', group: 'utility', image: './assets/flow/shared-cart.png',
      description: '상단 공동 장바구니 아이콘에서 함께 마실 사람들의 취향을 선택하는 화면으로 이동합니다.',
      point: [0.805, 0.105],
    },
    explore: {
      number: '03', title: '주류 탐색', group: 'discovery', image: './assets/flow/explore.png',
      description: '와인·맥주·양주·하이볼·기타주류 카테고리를 눌러 상품 탐색 화면으로 이동합니다.',
      point: [0.963, 0.740], fixedPoint: true,
    },
    'drink-id': {
      number: '04', title: 'MY DRINK ID', group: 'discovery', image: './assets/flow/drink-id.png',
      description: 'MY DRINK ID 배너에서 나의 취향 유형과 개인화 탐색을 확인하는 화면으로 이동합니다.',
      point: [0.932, 0.503], fixedPoint: true,
    },
    'first-drink': {
      number: '05', title: '인생 첫 술', group: 'campaign', image: './assets/flow/first-drink.png',
      description: '메인 캐러셀 두 번째 배너에서 소중한 사람을 위한 커스텀 주류 선물 이벤트로 이동합니다.',
      point: [0.50, 0.36], carouselIndex: 1,
    },
    'liquor-card': {
      number: '06', title: '주류 카드', group: 'campaign', image: './assets/flow/liquor-card.png',
      description: '메인 캐러셀 세 번째 배너에서 카드를 넘기며 오늘의 술을 고르는 경험으로 이동합니다.',
      point: [0.50, 0.36], carouselIndex: 2,
    },
    pairing: {
      number: '07', title: '조합 찾기', group: 'campaign', image: './assets/flow/pairing.png',
      description: '메인 캐러셀 네 번째 배너에서 와인과 음식의 조합을 찾는 이벤트로 이동합니다.',
      point: [0.50, 0.36], carouselIndex: 3,
    },
  };

  let introIndex = 0;
  let splashTimer = 0;
  let selectedId = '';
  let pinnedId = '';
  let activeGroup = '';

  function fitAppFrame(frame, container, inset = 0) {
    const designWidth = 390;
    const designHeight = 844;
    const availableWidth = Math.max(1, container.clientWidth - inset * 2);
    const availableHeight = Math.max(1, container.clientHeight - inset * 2);
    const scale = Math.min(availableWidth / designWidth, availableHeight / designHeight);
    const renderedWidth = designWidth * scale;
    const renderedHeight = designHeight * scale;

    frame.style.width = `${designWidth}px`;
    frame.style.height = `${designHeight}px`;
    frame.style.left = `${inset + (availableWidth - renderedWidth) / 2}px`;
    frame.style.top = `${inset + (availableHeight - renderedHeight) / 2}px`;
    frame.style.transform = `scale(${scale})`;
    return scale;
  }

  function updateAppFrameScales() {
    const introOuterRadius = introPhone.clientWidth * 0.15;
    const introInnerRadius = Math.max(18, introOuterRadius - 8);
    introPhone.style.borderRadius = `${introOuterRadius}px`;
    introScreen.style.borderRadius = `${introInnerRadius}px`;
    const introScale = fitAppFrame(introApp, introScreen, 0);
    introApp.style.borderRadius = `${introInnerRadius / introScale}px`;

    const flowOuterRadius = flowPhone.clientWidth * 0.15;
    const flowInnerRadius = Math.max(18, flowOuterRadius - 8);
    flowPhone.style.borderRadius = `${flowOuterRadius}px`;
    const flowScale = fitAppFrame(flowApp, flowPhone, 8);
    flowApp.style.borderRadius = `${flowInnerRadius / flowScale}px`;
    result.style.borderRadius = `${flowInnerRadius}px`;
  }

  function loadAppFrame(frame) {
    if (!frame.src) frame.src = appUrl.href;
    window.requestAnimationFrame(updateAppFrameScales);
  }

  function renderIntro(index) {
    clearTimeout(splashTimer);
    introIndex = Math.max(0, Math.min(index, introSteps.length - 1));
    const step = introSteps[introIndex];

    introKicker.textContent = step.kicker;
    introTitle.innerHTML = step.title;
    introDescription.innerHTML = step.description;
    introNext.innerHTML = `${step.button} <span>→</span>`;
    introImage.src = step.image || './assets/flow/phone-entry.png';
    introImage.alt = step.alt;
    introScreen.className = `w25-present-screen ${step.className}`;
    introApp.title = step.alt;

    presentation.querySelectorAll('[data-intro-dot]').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === introIndex);
    });

    if (step.className === 'is-app') loadAppFrame(introApp);
    if (introIndex === 1) splashTimer = window.setTimeout(() => renderIntro(2), 720);
  }

  function advanceIntro() {
    if (!introPanel.classList.contains('is-active')) return;
    if (introIndex === introSteps.length - 1) {
      showFlow();
      return;
    }
    renderIntro(introIndex + 1);
  }

  function showFlow() {
    clearTimeout(splashTimer);
    introPanel.classList.remove('is-active');
    flowPanel.classList.add('is-active');
    loadAppFrame(flowApp);
    window.setTimeout(() => {
      updateAppFrameScales();
      clearSelection(true);
    }, 80);
  }

  function restart() {
    presentation.classList.remove('is-dismissed');
    result.hidden = true;
    flowPanel.classList.remove('is-active');
    introPanel.classList.add('is-active');
    clearSelection(true);
    renderIntro(0);
  }

  function dismissPresentation() {
    clearTimeout(splashTimer);
    presentation.classList.add('is-dismissed');
  }

  function cardFor(id) {
    return ideaCards.find((card) => card.dataset.idea === id);
  }

  function sendFocusToApp(id) {
    const idea = ideas[id];
    flowApp.contentWindow?.postMessage({
      type: 'w25-flow-focus',
      target: id,
      carouselIndex: idea?.carouselIndex,
    }, '*');
  }

  function drawConnector() {
    const idea = ideas[selectedId];
    const targetCard = cardFor(selectedId);
    if (!idea || !targetCard || result.hidden === false) {
      connector.classList.remove('is-visible');
      return;
    }

    const stageRect = flowStage.getBoundingClientRect();
    const phoneRect = flowPhone.getBoundingClientRect();
    const boardRect = ideaGrid.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    const width = Math.max(1, stageRect.width);
    const height = Math.max(1, stageRect.height);
    let startX = phoneRect.left - stageRect.left + phoneRect.width * idea.point[0];
    let startY = phoneRect.top - stageRect.top + phoneRect.height * idea.point[1];

    if (!idea.fixedPoint) {
      try {
        const sourceSelector = Number.isInteger(idea.carouselIndex)
          ? '[data-flow-dynamic="carousel"]'
          : `[data-flow-target="${selectedId}"]`;
        const sourceElement = flowApp.contentDocument?.querySelector(sourceSelector);
        if (sourceElement) {
          const sourceRect = sourceElement.getBoundingClientRect();
          const frameRect = flowApp.getBoundingClientRect();
          const scaleX = frameRect.width / 390;
          const scaleY = frameRect.height / 844;
          startX = frameRect.left - stageRect.left + sourceRect.right * scaleX;
          startY = frameRect.top - stageRect.top + (sourceRect.top + sourceRect.height / 2) * scaleY;
        }
      } catch {
        // Same-origin builds use the live element position; the supplied fallback handles external embeds.
      }
    }
    const endX = cardRect.left - stageRect.left - 5;
    const endY = cardRect.top - stageRect.top + Math.min(44, cardRect.height * 0.22);
    const phoneRight = phoneRect.right - stageRect.left;
    const boardLeft = boardRect.left - stageRect.left;
    const middleX = phoneRight + Math.max(26, (boardLeft - phoneRight) * 0.5);

    connector.setAttribute('viewBox', `0 0 ${width} ${height}`);
    connectorPath.setAttribute('d', `M ${startX} ${startY} H ${middleX} V ${endY} H ${endX}`);
    connector.classList.add('is-visible');
  }

  function applySelection(id, { pin = false, notifyApp = true } = {}) {
    if (!ideas[id]) return;
    selectedId = id;
    if (pin) pinnedId = id;

    ideaGrid.classList.add('has-selection');
    ideaCards.forEach((card) => card.classList.toggle('is-selected', card.dataset.idea === id));
    if (notifyApp) sendFocusToApp(id);
    window.requestAnimationFrame(drawConnector);
    window.setTimeout(drawConnector, 140);
    window.setTimeout(drawConnector, 420);
  }

  function clearSelection(keepPinned = false) {
    if (keepPinned && pinnedId) {
      applySelection(pinnedId, { notifyApp: false });
      return;
    }
    selectedId = '';
    pinnedId = '';
    ideaGrid.classList.remove('has-selection');
    ideaCards.forEach((card) => card.classList.remove('is-selected'));
    connector.classList.remove('is-visible');
    flowApp.contentWindow?.postMessage({ type: 'w25-flow-focus', target: '' }, '*');
  }

  function setGroup(group) {
    activeGroup = activeGroup === group ? '' : group;
    ideaGrid.classList.toggle('has-group', Boolean(activeGroup));
    groupButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.flowGroup === activeGroup));
    ideaCards.forEach((card) => card.classList.toggle('is-group-muted', Boolean(activeGroup) && card.dataset.group !== activeGroup));
  }

  introNext.addEventListener('click', advanceIntro);
  introHotspot.addEventListener('click', advanceIntro);
  presentation.querySelector('[data-presentation-restart]').addEventListener('click', restart);
  presentation.querySelector('[data-presentation-live]').addEventListener('click', dismissPresentation);
  presentation.querySelector('[data-flow-result-close]').addEventListener('click', () => {
    result.hidden = true;
    window.requestAnimationFrame(drawConnector);
  });
  ideaCards.forEach((card) => {
    const id = card.dataset.idea;
    card.addEventListener('mouseenter', () => applySelection(id, { notifyApp: true }));
    card.addEventListener('focus', () => applySelection(id, { notifyApp: true }));
    card.addEventListener('mouseleave', () => {
      if (pinnedId) applySelection(pinnedId, { notifyApp: true });
      else clearSelection(false);
    });
    card.addEventListener('blur', () => {
      if (pinnedId) applySelection(pinnedId, { notifyApp: true });
    });
    card.addEventListener('click', () => {
      pinnedId = id;
      applySelection(id, { pin: true, notifyApp: true });
    });
  });

  groupButtons.forEach((button) => button.addEventListener('click', () => setGroup(button.dataset.flowGroup)));

  window.addEventListener('message', (event) => {
    if (event.source !== flowApp.contentWindow || event.data?.type !== 'w25-flow-target') return;
    const { target, phase } = event.data;
    if (!ideas[target]) return;
    if (phase === 'leave') {
      if (pinnedId) applySelection(pinnedId, { notifyApp: true });
      else clearSelection(false);
      return;
    }
    applySelection(target, { pin: phase === 'pin', notifyApp: false });
  });

  introApp.addEventListener('load', updateAppFrameScales);
  flowApp.addEventListener('load', updateAppFrameScales);
  window.addEventListener('resize', () => window.requestAnimationFrame(() => {
    updateAppFrameScales();
    drawConnector();
  }));
  window.addEventListener('keydown', (event) => {
    if (presentation.classList.contains('is-dismissed')) {
      if (event.key.toLowerCase() === 'r') restart();
      return;
    }
    if ((event.key === ' ' || event.key === 'ArrowRight') && introPanel.classList.contains('is-active')) {
      event.preventDefault();
      advanceIntro();
      return;
    }
    if (/^[1-7]$/.test(event.key) && flowPanel.classList.contains('is-active')) {
      const id = Object.keys(ideas)[Number(event.key) - 1];
      applySelection(id, { pin: true, notifyApp: true });
      return;
    }
    if (event.key === 'Escape') {
      if (!result.hidden) {
        result.hidden = true;
        drawConnector();
      } else if (flowPanel.classList.contains('is-active')) {
        clearSelection(false);
      }
    }
    if (event.key.toLowerCase() === 'l') dismissPresentation();
    if (event.key.toLowerCase() === 'r') restart();
  });

  renderIntro(0);
})();
