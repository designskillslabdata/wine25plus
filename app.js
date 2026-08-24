function applyDisplayMode(isRealMobile) {
  document.documentElement.classList.toggle('w25-real-mobile', isRealMobile);
}

function syncDisplayMode() {
  const explicitMode = new URLSearchParams(window.location.search).get('display');
  if (explicitMode === 'mobile' || explicitMode === 'pc') {
    applyDisplayMode(explicitMode === 'mobile');
    return;
  }

  let isRealMobile = window.matchMedia('(max-width: 767px)').matches;

  if (window !== window.parent) {
    try {
      isRealMobile = window.parent.matchMedia('(max-width: 767px)').matches;
    } catch {
      // Cross-origin embedding falls back to the current viewport.
    }
  }

  applyDisplayMode(isRealMobile);
}

syncDisplayMode();
window.addEventListener('resize', syncDisplayMode);
window.addEventListener('message', (event) => {
  if (event.source !== window.parent) return;
  if (event.data?.type === 'w25-display-mode') applyDisplayMode(Boolean(event.data.mobile));
});

const isPresentationEmbed = new URLSearchParams(window.location.search).get('presentation') === '1';
let carouselController = null;
const carousel = document.querySelector('.hero-carousel');

if (carousel) {
  const track = carousel.querySelector('.hero-track');
  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const currentLabel = carousel.querySelector('[data-carousel-current]');
  const liveLabel = carousel.querySelector('[data-carousel-live]');
  const previousButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slideCount = slides.length;
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slideCount - 1].cloneNode(true);

  firstClone.classList.add('is-clone');
  lastClone.classList.add('is-clone');
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  track.prepend(lastClone);
  track.append(firstClone);

  let carouselIndex = 0;
  let trackPosition = 1;
  let isMoving = false;
  let autoplayTimer;
  let transitionFallback;
  let touchStartX = 0;
  let touchDidSwipe = false;

  function setTrackPosition(position, animate = true) {
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(-${position * 100}%)`;

    if (!animate) {
      track.getBoundingClientRect();
      track.style.transition = '';
    }
  }

  function updateCarouselState() {
    currentLabel.textContent = String(carouselIndex + 1);
    liveLabel.textContent = `${carouselIndex + 1}번째 배너`;

    slides.forEach((slide, index) => {
      const isActive = index === carouselIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
  }

  function finishMove() {
    clearTimeout(transitionFallback);

    if (trackPosition === 0) {
      trackPosition = slideCount;
      setTrackPosition(trackPosition, false);
    } else if (trackPosition === slideCount + 1) {
      trackPosition = 1;
      setTrackPosition(trackPosition, false);
    }

    isMoving = false;
  }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    if (prefersReducedMotion || isPresentationEmbed) return;
    autoplayTimer = setInterval(() => moveCarousel(1, false), 5000);
  }

  function moveCarousel(direction, resetAutoplay = true) {
    if (isMoving) return;

    isMoving = true;
    carouselIndex = (carouselIndex + direction + slideCount) % slideCount;
    trackPosition += direction;
    updateCarouselState();
    setTrackPosition(trackPosition);
    transitionFallback = setTimeout(finishMove, prefersReducedMotion ? 50 : 520);
    if (resetAutoplay) startAutoplay();
  }

  function goToCarousel(index, animate = true) {
    const nextIndex = Math.max(0, Math.min(Number(index) || 0, slideCount - 1));
    clearInterval(autoplayTimer);
    clearTimeout(transitionFallback);
    carouselIndex = nextIndex;
    trackPosition = carouselIndex + 1;
    isMoving = false;
    updateCarouselState();
    setTrackPosition(trackPosition, animate && !prefersReducedMotion);
  }

  carouselController = {
    goTo: goToCarousel,
    current: () => carouselIndex,
  };

  track.addEventListener('transitionend', (event) => {
    if (event.target === track && event.propertyName === 'transform') finishMove();
  });

  previousButton.addEventListener('click', () => {
    if (!touchDidSwipe) moveCarousel(-1);
  });

  nextButton.addEventListener('click', () => {
    if (!touchDidSwipe) moveCarousel(1);
  });

  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) < 40) return;

    touchDidSwipe = true;
    moveCarousel(deltaX > 0 ? -1 : 1);
    setTimeout(() => {
      touchDidSwipe = false;
    }, 350);
  }, { passive: true });

  carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', () => clearInterval(autoplayTimer));
  carousel.addEventListener('focusout', startAutoplay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(autoplayTimer);
    else startAutoplay();
  });

  setTrackPosition(trackPosition, false);
  updateCarouselState();
  startAutoplay();
}

const flowTargets = {
  cellar: document.querySelector('[data-flow-target="cellar"]'),
  'shared-cart': document.querySelector('[data-flow-target="shared-cart"]'),
  explore: document.querySelector('[data-flow-target="explore"]'),
  'drink-id': document.querySelector('[data-flow-target="drink-id"]'),
  'first-drink': carousel,
  'liquor-card': carousel,
  pairing: carousel,
};
const carouselFlowTargets = [null, 'first-drink', 'liquor-card', 'pairing'];
let focusedFlowElement = null;

function setLocalFlowFocus(element) {
  if (!isPresentationEmbed || !element) return;
  focusedFlowElement?.classList.remove('w25-flow-focus');
  focusedFlowElement = element;
  focusedFlowElement.classList.add('w25-flow-focus');
}

function clearLocalFlowFocus(element) {
  if (!isPresentationEmbed || focusedFlowElement !== element) return;
  focusedFlowElement.classList.remove('w25-flow-focus');
  focusedFlowElement = null;
}

function postFlowTarget(target, phase) {
  if (!isPresentationEmbed || window === window.parent || !target) return;
  window.parent.postMessage({ type: 'w25-flow-target', target, phase }, '*');
}

function currentCarouselFlowTarget() {
  const index = carouselController?.current() ?? 0;
  return carouselFlowTargets[index] || null;
}

document.querySelectorAll('[data-flow-target]').forEach((element) => {
  const target = element.dataset.flowTarget;
  element.addEventListener('mouseenter', () => {
    setLocalFlowFocus(element);
    postFlowTarget(target, 'hover');
  });
  element.addEventListener('mouseleave', () => {
    clearLocalFlowFocus(element);
    postFlowTarget(target, 'leave');
  });
  element.addEventListener('focusin', () => {
    setLocalFlowFocus(element);
    postFlowTarget(target, 'hover');
  });
  element.addEventListener('focusout', () => {
    clearLocalFlowFocus(element);
    postFlowTarget(target, 'leave');
  });
  element.addEventListener('click', () => postFlowTarget(target, 'pin'));
});

if (carousel) {
  carousel.addEventListener('mouseenter', () => {
    setLocalFlowFocus(carousel);
    postFlowTarget(currentCarouselFlowTarget(), 'hover');
  });
  carousel.addEventListener('mouseleave', () => {
    clearLocalFlowFocus(carousel);
    postFlowTarget(currentCarouselFlowTarget(), 'leave');
  });
  carousel.addEventListener('focusin', () => {
    setLocalFlowFocus(carousel);
    postFlowTarget(currentCarouselFlowTarget(), 'hover');
  });
  carousel.addEventListener('focusout', () => {
    clearLocalFlowFocus(carousel);
    postFlowTarget(currentCarouselFlowTarget(), 'leave');
  });
  carousel.addEventListener('click', () => {
    window.setTimeout(() => postFlowTarget(currentCarouselFlowTarget(), 'pin'), 40);
  });
}

window.addEventListener('message', (event) => {
  if (event.source !== window.parent || event.data?.type !== 'w25-flow-focus') return;

  focusedFlowElement?.classList.remove('w25-flow-focus');
  focusedFlowElement = null;
  const target = event.data.target;
  if (!target || !flowTargets[target]) return;

  if (Number.isInteger(event.data.carouselIndex)) carouselController?.goTo(event.data.carouselIndex, true);
  focusedFlowElement = flowTargets[target];
  focusedFlowElement.classList.add('w25-flow-focus');

  if (target === 'drink-id') {
    focusedFlowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

const messages = {
  search: '검색 화면을 준비 중입니다.',
  cart: '장바구니 화면을 준비 중입니다.',
  'shared-cart': '공동 장바구니 화면으로 연결됩니다.',
  'drink-id': 'MY DRINK ID 화면으로 연결됩니다.',
  profile: '내 정보 화면을 준비 중입니다.',
  store: '픽업 매장을 변경할 수 있습니다.',
  menu: '전체 메뉴를 준비 중입니다.',
};

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  if (action === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  showToast(messages[action] ?? '준비 중인 기능입니다.');
});
