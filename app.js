function applyDisplayMode(isRealMobile) {
  document.documentElement.classList.toggle('w25-real-mobile', isRealMobile);
}

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

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

const catalogData = {
  wine: {
    label: '와인',
    filters: ['레드', '화이트', '로제', '스파클링', '샴페인', 'MD 추천'],
    products: [
      { name: '신퀀타 꼴레지오네', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/wine-raw-01.png' },
      { name: '브랜드 앤 버터 피노누아', price: '29,300원', pickup: '08/05 부터 수령', image: './assets/catalog/wine-raw-04.png' },
      { name: '앙시앙땅 (카베쉬라)', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/wine-raw-06.png', imageClass: 'product-image--wine-crop' },
      { name: '알타감마 까베르네소비뇽', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/wine-raw-03.png' },
    ],
  },
  beer: {
    label: '맥주',
    filters: ['오비', '트라피스트', 'IPA', '수제맥주', '기획팩', 'MD 추천'],
    products: [
      { name: '블루문 캔', price: '45,800원', pickup: '08/07 부터 수령', image: './assets/catalog/beer-01.png', imageClass: 'product-image--beer-can' },
      { name: '갓생산) 카스프레쉬', price: '32,900원', pickup: '08/14 부터 수령', image: './assets/catalog/beer-02.png' },
      { name: '써머스비', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/beer-03.png' },
      { name: '카스 350ml', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/beer-04.png' },
    ],
  },
  liquor: {
    label: '양주',
    filters: ['싱글몰트 위스키', '기타 위스키', '데킬라', '스파클링', '샴페인', 'MD 추천'],
    products: [
      { name: '조니워커 그린', price: '77,000원', pickup: '08/05 부터 수령', image: './assets/catalog/liquor-01.png' },
      { name: '러셀 리저브 싱글배럴 라이', price: '79,800원', pickup: '08/05 부터 수령', image: './assets/catalog/liquor-02.png' },
      { name: '더 글렌그란트 15년', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/liquor-03.png' },
      { name: '와일드터키 롱브랜치', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/liquor-04.png' },
    ],
  },
  highball: {
    label: '하이볼',
    filters: ['하이볼', '사이다'],
    products: [
      { name: '소비뇽레몬블랑 하이볼', price: '85,900원', pickup: '08/05 부터 수령', image: './assets/catalog/highball-01.png', imageClass: 'product-image--cover' },
      { name: '햄깅이 딸기 하이볼', price: '26,000원', pickup: '08/05 부터 수령', image: './assets/catalog/highball-03.png', imageClass: 'product-image--highball-pack' },
      { name: '카발란 하이볼 위스키소다', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/highball-02.png', imageClass: 'product-image--highball-blue' },
      { name: '카발란 하이볼', price: '37,900원', pickup: '08/05 부터 수령', image: './assets/catalog/highball-04.png', imageClass: 'product-image--highball-yellow' },
    ],
  },
};

const detailProfiles = {
  wine: {
    eyebrow: 'WINE25+ PLUS WINE',
    metrics: [
      { label: '당도', value: 25 },
      { label: '바디감', value: 80 },
      { label: '산도', value: 34 },
    ],
    pairings: [
      { name: '블랙포도', description: '단맛이 와인의 산미를 부드럽게 만들어 밸런스가 좋습니다.' },
      { name: '체리', description: '신맛이 너무 강하지 않은 다크 체리가 특히 잘 어울립니다.' },
      { name: '무화과', description: '부드러운 단맛과 쫀득한 식감이 오크 풍미와 잘 어울립니다.' },
      { name: '자두', description: '적당한 산미와 달콤함이 붉은 과실 향을 살려줍니다.' },
    ],
  },
  beer: {
    eyebrow: 'WINE25+ PLUS BEER',
    metrics: [
      { label: '쓴맛', value: 38 },
      { label: '탄산감', value: 82 },
      { label: '바디감', value: 54 },
    ],
    pairings: [
      { name: '프레첼', description: '짭짤한 맛이 맥아의 고소함과 탄산감을 또렷하게 살려줍니다.' },
      { name: '치킨', description: '바삭한 튀김과 청량한 탄산이 깔끔한 조화를 만듭니다.' },
      { name: '소시지', description: '진한 육향과 맥주의 구수한 풍미가 잘 어울립니다.' },
      { name: '감자튀김', description: '담백한 감자와 소금기가 맥주의 쌉쌀한 끝맛을 받쳐줍니다.' },
    ],
  },
  liquor: {
    eyebrow: 'WINE25+ PLUS SPIRITS',
    metrics: [
      { label: '스모키', value: 68 },
      { label: '바디감', value: 88 },
      { label: '피니시', value: 76 },
    ],
    pairings: [
      { name: '다크초콜릿', description: '쌉쌀한 카카오가 위스키의 오크와 바닐라 향을 끌어냅니다.' },
      { name: '견과류', description: '고소한 풍미가 깊은 몰트 향과 자연스럽게 이어집니다.' },
      { name: '훈제치즈', description: '훈연 향과 묵직한 바디감이 긴 여운을 만들어줍니다.' },
      { name: '육포', description: '짭조름한 감칠맛이 스피릿의 달콤한 피니시를 강조합니다.' },
    ],
  },
  highball: {
    eyebrow: 'WINE25+ PLUS HIGHBALL',
    metrics: [
      { label: '단맛', value: 62 },
      { label: '탄산감', value: 86 },
      { label: '상쾌함', value: 80 },
    ],
    pairings: [
      { name: '가라아게', description: '레몬 향과 탄산이 튀김의 기름진 맛을 산뜻하게 정리합니다.' },
      { name: '과일', description: '가벼운 과일 산미가 하이볼의 향긋함을 더해줍니다.' },
      { name: '타코', description: '향신료와 청량한 탄산이 경쾌한 대비를 만듭니다.' },
      { name: '치즈', description: '부드러운 짠맛이 위스키 베이스의 풍미와 잘 어울립니다.' },
    ],
  },
};

const homeView = document.querySelector('.page-content');
const catalogView = document.querySelector('.catalog-page');
const catalogFilters = document.querySelector('.catalog-filters');
const catalogProducts = document.querySelector('.catalog-products');
const catalogCategoryLinks = Array.from(document.querySelectorAll('.catalog-category'));
const phoneShell = document.querySelector('.phone-shell');
const detailView = document.querySelector('.product-detail');
const detailImage = document.querySelector('.detail-product-image');
const detailGauges = document.querySelector('.detail-gauges');
const detailEyebrow = document.querySelector('.detail-eyebrow');
const detailName = document.querySelector('.detail-name');
const detailPrice = document.querySelector('.detail-price');
const detailDiscount = document.querySelector('.detail-discount');
const detailPickup = document.querySelector('.detail-pickup strong');
const pairingTrigger = document.querySelector('.pairing-trigger');
const pairingModal = document.querySelector('.pairing-modal');
const pairingRecommendations = document.querySelector('.pairing-recommendations');
const wineryView = document.querySelector('.winery-page');
const cellarView = document.querySelector('.cellar-page');
const cellarmateView = document.querySelector('.cellarmate-page');
const cellarmateScreens = Array.from(document.querySelectorAll('[data-cellarmate-screen]'));
const cellarmateTabs = Array.from(document.querySelectorAll('[data-cellarmate-tab]'));
const cellarmatePanels = Array.from(document.querySelectorAll('[data-cellarmate-panel]'));
const cellarmateCouponModal = document.querySelector('[data-cellarmate-coupon-modal]');
const kyoboEventView = document.querySelector('.kyobo-page');
const kyoboScreens = Array.from(document.querySelectorAll('[data-kyobo-screen]'));
const kyoboProductCarousel = document.querySelector('.kyobo-product-carousel');
const worldTourView = document.querySelector('.world-tour-page');
const worldTourScreens = Array.from(document.querySelectorAll('[data-world-tour-screen]'));
const partyQuestView = document.querySelector('.party-quest-page');
const partyQuestScreens = Array.from(document.querySelectorAll('[data-party-screen]'));
const partyQuestModals = Array.from(document.querySelectorAll('[data-party-modal]'));
const findItView = document.querySelector('.find-it-page');
const findItScreens = Array.from(document.querySelectorAll('[data-find-it-screen]'));
const findItGameImage = document.querySelector('.find-it-game-image');
const findItTargets = Array.from(document.querySelectorAll('[data-find-piece]'));
const findItPieceVisuals = Array.from(document.querySelectorAll('[data-find-piece-visual]'));
const findItCount = document.querySelector('[data-find-count]');
const findItCompleteModal = document.querySelector('[data-find-complete-modal]');
const tastePlusView = document.querySelector('.taste-plus-page');
const tastePlusScreens = Array.from(document.querySelectorAll('[data-taste-plus-screen]'));
const friendSelectView = document.querySelector('.friend-select-page');
const friendCarousel = document.querySelector('[data-friend-carousel]');
const friendCards = Array.from(document.querySelectorAll('[data-friend-index]'));
const friendDots = Array.from(document.querySelectorAll('.friend-character-dots i'));
const friendDescription = document.querySelector('[data-friend-description]');
const friendEventModal = document.querySelector('[data-friend-event-modal]');
const friendMileageView = document.querySelector('.friend-mileage-page');
const friendMileageMissions = Array.from(document.querySelectorAll('[data-friend-mission]'));
const friendPoints = document.querySelector('[data-friend-points]');
const friendPointsValue = document.querySelector('[data-friend-points-value]');
const friendGiftModal = document.querySelector('[data-friend-gift-modal]');
const pairingFinderView = document.querySelector('.pairing-finder-page');
const pairingFinderScreens = Array.from(document.querySelectorAll('[data-pairing-finder-screen]'));
let tastePlusLoadingTimer = 0;
let tastePlusResultTimer = 0;
let worldTourLoadingTimer = 0;
let partyQuestLoadingTimer = 0;
let activeFriendIndex = 0;
const completedFriendMissions = new Set();
let friendGiftShown = false;

const friendCharacters = [
  { name: '무무씨', image: './assets/drink-friends/mumu.png', color: '#ffa300', description: '퇴근 후 시원한 맥주 한 잔이 삶의 낙<br />무념무상 매일 똑같이 지나가는 하루도<br />소맥과 함께라면 이겨낼 수 있어' },
  { name: '안드레씨', image: './assets/drink-friends/andre.png', color: '#82daf7', description: '조용해 보여도 술자리에서는 반전 매력<br />익숙한 술도 새로운 조합으로 즐기는<br />든든한 주당 친구와 함께해요' },
  { name: '머용씨', image: './assets/drink-friends/meoyong.png', color: '#fe6600', description: '처음 보는 술이라면 일단 궁금한 탐험가<br />새로운 향과 맛을 찾아 어디든 떠나는<br />호기심 많은 친구와 함께해요' },
  { name: '순남씨', image: './assets/drink-friends/sunnam.png', color: '#56b85a', description: '좋은 사람과 천천히 즐기는 한 잔을 좋아해요<br />오늘의 분위기에 잘 맞는 술을 골라주는<br />차분하고 다정한 친구와 함께해요' },
];

/*
 * Shared mobile chrome
 * --------------------
 * Figma exports sometimes contain their own status/app bars.  Those pixels are
 * treated as artwork only; the interactive chrome below is the single source
 * of truth for position, icons and hit targets on every full-screen flow.
 */
const standaloneChrome = new Map();

function createStandaloneChrome(page, key) {
  if (!page) return null;
  const sourceStatus = document.querySelector('.app-header .status-bar');
  const chrome = document.createElement('div');
  chrome.className = 'standalone-chrome';
  if (sourceStatus) {
    const status = sourceStatus.cloneNode(true);
    status.classList.add('app-statusbar');
    chrome.append(status);
  }

  const header = document.createElement('header');
  header.className = 'app-topbar';
  header.innerHTML = `
    <button class="app-topbar-button app-topbar-back" type="button" aria-label="이전 화면"></button>
    <h1></h1>
    <div class="app-topbar-actions">
      <button class="app-topbar-button app-topbar-share" type="button" data-action="share" aria-label="공유하기"></button>
      <button class="app-topbar-button app-topbar-home" type="button" aria-label="홈으로 나가기"></button>
    </div>`;
  chrome.append(header);
  page.prepend(chrome);

  const record = {
    chrome,
    title: header.querySelector('h1'),
    back: header.querySelector('.app-topbar-back'),
    share: header.querySelector('.app-topbar-share'),
    home: header.querySelector('.app-topbar-home'),
  };
  record.home.addEventListener('click', () => { window.location.hash = '#top'; });
  standaloneChrome.set(key, record);
  return record;
}

function createStandaloneStatus(page) {
  const sourceStatus = document.querySelector('.app-header .status-bar');
  if (!page || !sourceStatus) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'standalone-status-only';
  const status = sourceStatus.cloneNode(true);
  status.classList.add('app-statusbar');
  wrapper.append(status);
  page.prepend(wrapper);
}

const worldTourChrome = createStandaloneChrome(worldTourView, 'world-tour');
const partyQuestChrome = createStandaloneChrome(partyQuestView, 'party-quest');
const kyoboChrome = createStandaloneChrome(kyoboEventView, 'kyobo');
const findItChrome = createStandaloneChrome(findItView, 'find-it');
const pairingFinderChrome = createStandaloneChrome(pairingFinderView, 'pairing-finder');
createStandaloneStatus(tastePlusView);

const worldTourChromeRules = {
  world: ['세계 주류 여행', 'home', true],
  japan: ['세계 주류 여행', 'world', false],
  niigata: ['세계 주류 여행', 'japan', false],
  product: ['상품 상세', 'niigata', false],
  reserve: ['결제 완료', 'product', false],
  coupon: ['쿠폰', 'reserve', false],
  'travel-all': ['세계 주류 여행', 'reserve', false],
  'travel-wine': ['세계 주류 여행', 'travel-all', false],
  'travel-sake': ['세계 주류 여행', 'travel-all', false],
  'modetour-loading': ['', 'travel-sake', false],
  'modetour-detail': ['', 'travel-sake', false],
};
const partyQuestChromeRules = {
  home: ['', 'home', false], calendar: ['', 'home', false], theme: ['', 'calendar', false],
  loading: ['', 'theme', false], card: ['', 'theme', false], quest: ['파티 플러스', 'home', false],
  cart: ['우리끼리 주문서 만들기', 'quest', false], pickup: ['파티 플러스', 'cart', false],
  camera: ['픽업 인증', 'pickup', false], shot: ['픽업 인증', 'camera', false], complete: ['파티 플러스', 'quest', false],
};
const kyoboChromeRules = {
  event: ['이벤트 상세', 'home', true],
  instagram: ['WINE25+ 공식', 'event', false],
  linktree: ['이벤트 상세', 'instagram', false],
};
const findItChromeRules = {
  game: ['보물찾기', 'home', false],
  coupon: ['쿠폰', 'game', false],
};
const sharedCartChromeRules = {
  result: ['', 'summary', false],
  product: ['상품 안내', 'result', false],
  cart: ['장바구니', 'result', false],
};

function updateStandaloneChrome(record, rule, routePrefix) {
  if (!record || !rule) return;
  const [title, backTarget, canShare] = rule;
  record.title.textContent = title;
  record.share.hidden = !canShare;
  record.back.onclick = () => {
    window.location.hash = backTarget === 'home' ? '#top' : `#${routePrefix}/${backTarget}`;
  };
}
const membershipRange = document.querySelector('#membership-range');
const membershipName = document.querySelector('[data-membership-name]');
const membershipMessage = document.querySelector('[data-membership-message]');
const membershipLabels = Array.from(document.querySelectorAll('.membership-labels span'));
const cellarGrid = document.querySelector('.cellar-grid');
const cellarTabs = Array.from(document.querySelectorAll('[data-cellar-category]'));
const drinkIdView = document.querySelector('.drink-id-page');
const drinkScreens = Array.from(document.querySelectorAll('[data-drink-screen]'));
const surveyQuestion = document.querySelector('.survey-question');
const surveyCount = document.querySelector('.survey-count strong');
const surveyProgress = document.querySelector('.survey-progress');
const resultMetrics = Array.from(document.querySelectorAll('.result-metrics'));
const friendGrid = document.querySelector('.friend-grid');
const aiChatQuestion = document.querySelector('[data-ai-chat-question]');
const aiChatMessages = document.querySelector('.ai-chat-messages');
const sharedCartView = document.querySelector('.shared-cart-page');
const sharedCartChrome = createStandaloneChrome(sharedCartView, 'shared-cart');
const drinkBrowseChrome = createStandaloneChrome(drinkIdView, 'drink-browse');
const sharedCartScreens = Array.from(document.querySelectorAll('[data-shared-cart-screen]'));
const sharedCartForm = document.querySelector('[data-shared-cart-form]');
const meetingInput = sharedCartForm?.elements.meeting;
const meetingCount = document.querySelector('[data-meeting-count]');
const cardPickView = document.querySelector('.card-pick-page');
const cardPickScreens = Array.from(document.querySelectorAll('[data-card-pick-screen]'));
const cardCategoryOptions = Array.from(document.querySelectorAll('[data-card-category]'));
const cardCategoryNext = document.querySelector('[data-card-pick-go="cards"]');
const cardArcStage = document.querySelector('.card-arc-stage');
const cardArc = document.querySelector('.card-arc');
const cardWheelDecoration = document.querySelector('.card-wheel-decoration');
const cardPickConfirm = document.querySelector('[data-card-pick-confirm]');
const resultFlipScene = document.querySelector('[data-card-flip]');
const resultFront = document.querySelector('.result-card-front');
const resultBack = document.querySelector('.result-card-back');
const resultTitle = document.querySelector('[data-result-title]');
const resultTagline = document.querySelector('[data-result-tagline]');
const resultShareModal = document.querySelector('[data-result-share-modal]');
const resultShareCardTitle = document.querySelector('[data-share-card-title]');
const resultShareUrl = document.querySelector('[data-result-share-url]');
const resultShareStatus = document.querySelector('[data-result-share-status]');
const giftFlowView = document.querySelector('.gift-flow-page');
const giftFlowScreens = Array.from(document.querySelectorAll('[data-gift-screen]'));
const giftSlots = document.querySelector('[data-gift-slots]');
const giftProductsView = document.querySelector('[data-gift-products]');
const giftFiltersView = document.querySelector('[data-gift-filters]');
const giftCategoryButtons = Array.from(document.querySelectorAll('[data-gift-category]'));
const giftSelectionStatus = document.querySelector('[data-gift-selection-status]');
const giftReserveButton = document.querySelector('[data-gift-reserve]');
const giftReserveModal = document.querySelector('[data-gift-reserve-modal]');
const giftQuantityValue = document.querySelector('[data-gift-quantity-value]');
const giftTotalPrice = document.querySelector('[data-gift-total-price]');
let activeDetail = null;
let surveyIndex = 0;
let surveyAnswers = [];
let analysisTimer = null;
let sharedCartTimer = null;
let activeDrinkType = 'curious-beginner';
let activeAiQuestion = '달달하고 맛있는 와인을 추천해줘';
const sharedCartChoices = {};
let activeCardCategory = '';
let activeCardIndex = 1;
let selectedCardIndex = null;
let cardWheelPosition = 1;
let cardDragStartPosition = 1;
let cardPointerStartX = 0;
let cardPointerMoved = false;
const foundTreasures = new Set();
let cardPointerCardIndex = null;
let suppressCardClick = false;
let cardLastPointerX = 0;
let cardLastPointerTime = 0;
let cardVelocityX = 0;
let cardInertiaFrame = null;
let activeGiftCategory = 'all';
let activeGiftFilter = '전체';
let selectedGiftProducts = [];
let giftQuantity = 1;

const giftCategoryFilters = {
  all: [],
  liquor: ['전체', '위스키', '보드카/진', '리큐르', '데킬라/럼/브랜디'],
  beer: ['전체', '라거', '에일', '밀맥주', '사이더'],
  wine: ['전체', '레드', '화이트', '로제', '스파클링'],
  traditional: ['전체', '약주', '탁주', '증류주'],
  other: ['전체', '하이볼', '칵테일', '미니어처'],
};

const giftProductData = [
  { id: 'absolut-blue', category: 'liquor', filter: '보드카/진', type: 'VODKA', name: '엡솔루트 블루', note: '깔끔하고 부드러운 프리미엄 보드카', image: './assets/gift-flow/product-08.png', slotImage: './assets/gift-flow/product-08-slot.png' },
  { id: 'jack-no7', category: 'liquor', filter: '위스키', type: 'WHISKEY', name: '잭다니엘 No.7', note: '강렬한 바닐라, 카라멜, 오크의 조화', image: './assets/gift-flow/product-02.png' },
  { id: 'absolut-apeach', category: 'liquor', filter: '보드카/진', type: 'VODKA', name: '엡솔루트 어피치', note: '복숭아 향이 산뜻하게 번지는 보드카', image: './assets/gift-flow/product-06.png' },
  { id: 'chartreuse', category: 'liquor', filter: '리큐르', type: 'LIQUEUR', name: '샤르트뢰즈 옐로우', note: '허브 향과 달콤함이 어우러진 리큐르', image: './assets/gift-flow/product-05.png' },
  { id: 'jack-honey', category: 'liquor', filter: '위스키', type: 'WHISKEY', name: '잭다니엘 허니', note: '꿀의 달콤한 맛과 오크의 깊은 향', image: './assets/gift-flow/product-07.png' },
  { id: 'scallywag', category: 'liquor', filter: '위스키', type: 'WHISKEY', name: '스캘리웩', note: '풍부한 셰리와 향신료의 긴 여운', image: './assets/gift-flow/product-10.png' },
  { id: 'blue-moon', category: 'beer', filter: '밀맥주', type: 'WHEAT BEER', name: '블루문 캔', note: '오렌지 향이 은은한 부드러운 밀맥주', image: './assets/catalog/beer-01.png' },
  { id: 'cass', category: 'beer', filter: '라거', type: 'LAGER', name: '카스 프레시', note: '가볍고 깨끗하게 마무리되는 라거', image: './assets/catalog/beer-02.png' },
  { id: 'sommersby', category: 'beer', filter: '사이더', type: 'CIDER', name: '써머스비', note: '상큼한 사과 향과 산뜻한 탄산감', image: './assets/catalog/beer-03.png' },
  { id: 'cinquanta', category: 'wine', filter: '레드', type: 'RED WINE', name: '신퀀타 꼴레지오네', note: '짙은 과실향과 균형 잡힌 바디감', image: './assets/catalog/wine-raw-01.png' },
  { id: 'brand-butter', category: 'wine', filter: '레드', type: 'RED WINE', name: '브랜드 앤 버터 피노누아', note: '부드러운 질감과 섬세한 베리 향', image: './assets/catalog/wine-raw-04.png' },
  { id: 'ancient', category: 'wine', filter: '레드', type: 'RED WINE', name: '앙시앙땅 카베쉬라', note: '스파이시한 향이 매력적인 레드 와인', image: './assets/catalog/wine-raw-06.png' },
  { id: 'traditional', category: 'traditional', filter: '약주', type: 'YAKJU', name: '담은 약주', note: '쌀의 은은한 단맛과 깨끗한 끝맛', image: './assets/account/bottle-02.png' },
  { id: 'makgeolli', category: 'traditional', filter: '탁주', type: 'TAKJU', name: '느린마을 막걸리', note: '부드러운 쌀 향과 산뜻한 산미', image: './assets/account/bottle-05.png' },
  { id: 'highball', category: 'other', filter: '하이볼', type: 'HIGHBALL', name: '카발란 하이볼', note: '위스키 향과 청량한 탄산의 조화', image: './assets/catalog/highball-04.png' },
  { id: 'miniature', category: 'other', filter: '미니어처', type: 'MINIATURE', name: '미니어처 셀렉션', note: '여러 풍미를 가볍게 경험하는 구성', image: './assets/gift-flow/product-11.png' },
];

const cardCategoryLabels = {
  movie: '영화',
  music: '음악',
  season: '계절',
  place: '장소',
};

const cardPickCards = [
  { key: 'hiphop', title: 'HIP-HOP', tagline: '스파이시한 청량감', tone: 'green' },
  { key: 'rock', title: 'Rock', tagline: '강렬하고 알싸한 자극', tone: 'red' },
  { key: 'pop', title: 'POP', tagline: '달콤한 청량감', tone: 'blue' },
  { key: 'classic', title: 'Classic', tagline: '깔끔하고 산뜻한 마무리', tone: 'yellow' },
  { key: 'jazz', title: 'Jazz', tagline: '묵직하고 부드러운 여운', tone: 'navy' },
  { key: 'indie', title: 'INDIE', tagline: '낯설고 섬세한 향기', tone: 'purple' },
  { key: 'disco', title: 'DISCO', tagline: '톡 쏘는 화려한 리듬', tone: 'orange' },
  { key: 'chill', title: 'CHILL', tagline: '가볍고 편안한 한 모금', tone: 'mint' },
];

const membershipTiers = [
  { name: '루키', color: '#2f7c32', accent: '#1f6c24', soft: '#abc7ab', message: '다음 등급까지 <strong>150,000원</strong> 남았어요!' },
  { name: '매니아', color: '#e9b600', accent: '#806400', soft: '#e3d6b5', message: '다음 등급까지 <strong>150,000원</strong> 남았어요!' },
  { name: '소믈리에', color: '#d81810', accent: '#bf100a', soft: '#e9b7b9', message: '다음 등급까지 <strong>350,000원</strong> 남았어요!' },
  { name: '마스터', color: '#126bbb', accent: '#07599e', soft: '#aec9dd', message: '<strong>최고 등급</strong>을 달성했어요!' },
];

const cellarBottles = [
  { image: './assets/account/mascot-cellar.png', category: 'wine', label: '디코이 소비뇽 블랑' },
  { image: './assets/account/bottle-01.png', category: 'wine', label: '화이트 와인' },
  { image: './assets/account/bottle-02.png', category: 'wine', label: '레드 와인' },
  { image: './assets/account/bottle-03.png', category: 'liquor', label: '위스키' },
  { image: './assets/account/bottle-04.png', category: 'beer', label: '맥주' },
  { image: './assets/account/bottle-05.png', category: 'liquor', label: '보드카' },
  { image: './assets/account/bottle-06.png', category: 'beer', label: '라거 맥주' },
];

const drinkQuestions = [
  '술 라벨을 보면 어떤 술인지\n어느 정도 알 수 있다.',
  '주종이나 품종의 차이를\n알고 있다.',
  '술을 고를 때 추천보다\n내 기준으로 선택한다.',
  '항상 새로운 술을\n도전해보고 싶다.',
  '평소 마시던 술보다\n새로운 술을 고르는 편이다.',
  '한번도 안 마셔본 술이라도\n궁금하면 바로 도전한다.',
  '도수가 높은 술도\n부담 없이 즐긴다.',
  '술자리에서 기분 좋게\n취하는 것을 좋아한다.',
  '술은 분위기보다\n알코올 맛으로 마시는 편이다.',
];

const drinkTypes = {
  'curious-beginner': { name: '호기심 입문형', tagline: '취향을 찾아가는 탐험가', color: '#2668ff', shape: './assets/drink-id/type-blue.svg', sommelier: '무무씨', knowledge: false, explore: true, intensity: false },
  'comfort-cup': { name: '편안한 찻잔형', tagline: '익숙한 한 잔을 천천히 즐기는 휴식가', color: '#2668ff', shape: './assets/drink-id/type-blue.svg', sommelier: '무무씨', knowledge: false, explore: false, intensity: false },
  'straight-beginner': { name: '분위기파', tagline: '술보다 그 순간의 분위기를 마시는 감성파', color: '#efb900', shape: './assets/drink-id/type-yellow.svg', sommelier: '안드레씨', knowledge: false, explore: false, intensity: true },
  'bold-explorer': { name: '술맛 도전파', tagline: '새로운 술맛에 도전하는 모험가', color: '#efb900', shape: './assets/drink-id/type-yellow.svg', sommelier: '안드레씨', knowledge: false, explore: true, intensity: true },
  tipsy: { name: '알딸딸형', tagline: '기분 좋은 한 잔을 즐기는 여유파', color: '#13a52a', shape: './assets/drink-id/type-green.svg', sommelier: '순남씨', knowledge: true, explore: false, intensity: false },
  'light-explorer': { name: '모든걸 먹고파', tagline: '가리지 않고 경험해보는 수집가', color: '#13a52a', shape: './assets/drink-id/type-green.svg', sommelier: '순남씨', knowledge: true, explore: true, intensity: false },
  drinker: { name: '얼큰한 주당형', tagline: '제대로 즐길 줄 아는 애주가', color: '#f14b2f', shape: './assets/drink-id/type-red.svg', sommelier: '머용씨', knowledge: true, explore: false, intensity: true },
  veteran: { name: '주류 고인물', tagline: '취향도 지식도 확실한 술잘알', color: '#f14b2f', shape: './assets/drink-id/type-red.svg', sommelier: '머용씨', knowledge: true, explore: true, intensity: true },
};

function createProductCard(product, category, index) {
  const article = document.createElement('a');
  article.className = 'product-card';
  article.href = `#product/${category}/${index}`;
  article.setAttribute('aria-label', `${product.name} 상세 보기`);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'product-image-wrap';
  const image = document.createElement('img');
  image.src = product.image;
  image.alt = product.name;
  if (product.imageClass) image.classList.add(product.imageClass);
  imageWrap.append(image);

  const meta = document.createElement('div');
  meta.className = 'product-meta';
  const pickup = document.createElement('span');
  pickup.className = 'pickup-label';
  pickup.textContent = product.pickup;
  const actions = document.createElement('img');
  actions.className = 'product-actions';
  actions.src = './assets/catalog/product-actions.svg';
  actions.alt = '찜 및 장바구니';
  meta.append(pickup, actions);

  const name = document.createElement('h2');
  name.className = 'product-name';
  name.textContent = product.name;
  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = product.price;

  article.append(imageWrap, meta, name, price);
  return article;
}

function hideSharedCart() {
  clearTimeout(sharedCartTimer);
  sharedCartView.hidden = true;
  phoneShell.classList.remove('is-shared-cart-view', 'is-shared-cart-figma', 'is-shared-cart-common-chrome');
}

function hideCardPick() {
  cardPickView.hidden = true;
  phoneShell.classList.remove('is-card-pick-view');
}

function closeGiftReserveModal() {
  if (!giftReserveModal) return;
  giftReserveModal.hidden = true;
  phoneShell.classList.remove('is-gift-modal-open');
}

function hideGiftFlow() {
  if (!giftFlowView) return;
  giftFlowView.hidden = true;
  phoneShell.classList.remove('is-gift-view');
  closeGiftReserveModal();
}

function hideCellarmate() {
  if (!cellarmateView) return;
  cellarmateView.hidden = true;
  cellarmateCouponModal.hidden = true;
  phoneShell.classList.remove('is-cellarmate-view');
}

function hideKyoboEvent() {
  if (!kyoboEventView) return;
  kyoboEventView.hidden = true;
  phoneShell.classList.remove('is-kyobo-view');
}

function hideWorldTour() {
  if (!worldTourView) return;
  window.clearTimeout(worldTourLoadingTimer);
  worldTourLoadingTimer = 0;
  worldTourView.hidden = true;
  delete worldTourView.dataset.activeScreen;
  phoneShell.classList.remove('is-world-tour-view');
}

function closePartyQuestModals() {
  partyQuestModals.forEach((modal) => { modal.hidden = true; });
}

function hidePartyQuest() {
  if (!partyQuestView) return;
  window.clearTimeout(partyQuestLoadingTimer);
  partyQuestLoadingTimer = 0;
  closePartyQuestModals();
  partyQuestView.hidden = true;
  phoneShell.classList.remove('is-party-quest-view');
}

function hideFindIt() {
  if (!findItView) return;
  findItView.hidden = true;
  findItCompleteModal.hidden = true;
  phoneShell.classList.remove('is-find-it-view');
}

function hideTastePlus() {
  window.clearTimeout(tastePlusLoadingTimer);
  window.clearTimeout(tastePlusResultTimer);
  tastePlusLoadingTimer = 0;
  tastePlusResultTimer = 0;
  if (!tastePlusView) return;
  tastePlusView.hidden = true;
  phoneShell.classList.remove('is-taste-plus-view');
}

function hideFriendSelect() {
  if (!friendSelectView) return;
  friendSelectView.hidden = true;
  phoneShell.classList.remove('is-friend-select-view');
}

function hideFriendMileage() {
  if (!friendMileageView) return;
  if (friendGiftModal) {
    friendGiftModal.hidden = true;
    friendGiftModal.classList.remove('is-open');
  }
  friendMileageView.hidden = true;
  phoneShell.classList.remove('is-friend-mileage-view');
}

function updateFriendMileage() {
  const completedCount = completedFriendMissions.size;
  const points = completedCount === 3 ? 250 : Math.round(150 + (completedCount * 100 / 3));
  const progress = 60 + (completedCount * 40 / 3);
  friendPoints?.style.setProperty('--friend-points-progress', `${progress}%`);
  if (friendPointsValue) friendPointsValue.textContent = `${points}pt`;
  if (friendPoints) friendPoints.setAttribute('aria-label', `마일리지 ${points} 포인트`);
  document.querySelectorAll('.friend-points-labels small').forEach((label) => {
    label.classList.toggle('is-current', label.textContent === `${points}pt` || (points === 250 && label.textContent === '250pt'));
  });
}

function resetFriendMileage() {
  completedFriendMissions.clear();
  friendGiftShown = false;
  friendMileageMissions.forEach((mission) => {
    mission.classList.remove('is-complete', 'is-completing');
    const kind = mission.dataset.friendMission;
    mission.style.setProperty('--mission-progress', kind === 'login' ? '60%' : kind === 'pick' ? '40%' : '0%');
    const status = mission.querySelector('small');
    if (status) status.textContent = kind === 'login' ? '3/5' : kind === 'pick' ? '2/5' : '참여하기';
  });
  updateFriendMileage();
}

function showFriendGift() {
  if (!friendGiftModal || friendGiftShown) return;
  friendGiftShown = true;
  friendGiftModal.hidden = false;
  window.requestAnimationFrame(() => friendGiftModal.classList.add('is-open'));
  friendGiftModal.querySelector('.friend-gift-card')?.focus({ preventScroll: true });
}

function closeFriendGift() {
  if (!friendGiftModal) return;
  friendGiftModal.classList.remove('is-open');
  window.setTimeout(() => { friendGiftModal.hidden = true; }, 240);
}

function hidePairingFinder() {
  if (!pairingFinderView) return;
  pairingFinderView.hidden = true;
  phoneShell.classList.remove('is-pairing-finder-view');
}

function closeFriendEvent() {
  if (!friendEventModal) return;
  friendEventModal.classList.remove('is-open');
  window.setTimeout(() => {
    if (!friendEventModal.classList.contains('is-open')) friendEventModal.hidden = true;
  }, 360);
}

function openFriendEvent() {
  if (!friendEventModal) return;
  friendEventModal.hidden = false;
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => friendEventModal.classList.add('is-open')));
}

function setActiveFriend(index, scroll = false) {
  activeFriendIndex = Math.max(0, Math.min(friendCharacters.length - 1, Number(index) || 0));
  friendCards.forEach((card, cardIndex) => {
    const selected = cardIndex === activeFriendIndex;
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-selected', String(selected));
  });
  friendDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeFriendIndex));
  if (friendDescription) friendDescription.innerHTML = friendCharacters[activeFriendIndex].description;
  if (scroll && friendCarousel) {
    const card = friendCards[activeFriendIndex];
    if (card) {
      const left = card.offsetLeft - ((friendCarousel.clientWidth - card.offsetWidth) / 2);
      friendCarousel.scrollTo({ left, behavior: 'smooth' });
    }
  }
}

function renderFriendSelect() {
  hideTastePlus();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  hideWorldTour();
  hideFriendMileage();
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  friendSelectView.hidden = false;
  phoneShell.className = 'phone-shell is-friend-select-view';
  setActiveFriend(activeFriendIndex);
  friendSelectView.scrollTo({ top: 0, behavior: 'auto' });
  window.requestAnimationFrame(() => {
    setActiveFriend(activeFriendIndex, true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
}

function renderFriendMileage() {
  hideTastePlus();
  hideFriendSelect();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  hideWorldTour();
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  friendMileageView.hidden = false;
  phoneShell.className = 'phone-shell is-friend-mileage-view';
  friendMileageView.scrollTo({ top: 0, behavior: 'auto' });
}

function renderPairingFinder(screen = 'list') {
  hideTastePlus();
  hideFriendSelect();
  hideFriendMileage();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  hideWorldTour();
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  pairingFinderView.hidden = false;
  pairingFinderView.classList.toggle('is-detail-screen', screen === 'detail');
  updateStandaloneChrome(pairingFinderChrome, ['맛잘알 조합찾기', 'list', false], 'pairing-finder');
  pairingFinderScreens.forEach((element) => { element.hidden = element.dataset.pairingFinderScreen !== screen; });
  phoneShell.className = 'phone-shell is-pairing-finder-view';
  pairingFinderView.scrollTo({ top: 0, behavior: 'auto' });
}

function applySelectedFriend() {
  const friend = friendCharacters[activeFriendIndex];
  resetFriendMileage();
  document.querySelectorAll('[data-friend-banner-default]').forEach((element) => { element.hidden = true; });
  document.querySelectorAll('[data-friend-selected-banner]').forEach((banner) => {
    banner.hidden = false;
    banner.style.setProperty('--friend-color', friend.color);
    banner.querySelectorAll('[data-friend-banner-name]').forEach((name) => { name.textContent = friend.name; });
    const character = banner.querySelector('[data-friend-banner-character]');
    if (character) character.src = friend.image;
  });
  document.querySelectorAll('[data-story-action="drink-friends"]').forEach((slide) => {
    slide.dataset.storyAction = 'friend-mileage';
    slide.setAttribute('aria-label', `${friend.name}랑 같이 술마시자`);
  });
  document.querySelectorAll('[data-story-open][data-action="drink-friends"]').forEach((button) => { button.dataset.action = 'friend-mileage'; });
  document.querySelectorAll('[data-friend-mileage-name]').forEach((name) => { name.textContent = friend.name; });
  document.querySelectorAll('[data-friend-mileage-character]').forEach((character) => {
    character.src = friend.image;
    character.alt = `${friend.name} 캐릭터`;
  });
}

function renderTastePlus(screen) {
  window.clearTimeout(tastePlusLoadingTimer);
  window.clearTimeout(tastePlusResultTimer);
  tastePlusLoadingTimer = 0;
  tastePlusResultTimer = 0;
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  hideWorldTour();
  tastePlusView.hidden = false;
  tastePlusScreens.forEach((element) => {
    element.hidden = element.dataset.tastePlusScreen !== screen;
    element.classList.remove('is-animating', 'is-complete');
  });
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view', 'is-shared-cart-view', 'is-card-pick-view', 'is-gift-view', 'is-cellarmate-view', 'is-kyobo-view', 'is-find-it-view', 'is-world-tour-view');
  phoneShell.classList.add('is-taste-plus-view');
  tastePlusView.scrollTo({ top: 0, behavior: 'auto' });

  if (screen === 'loading') {
    tastePlusLoadingTimer = window.setTimeout(() => {
      window.location.hash = '#taste-plus/result';
    }, 1650);
  }

  if (screen === 'result') {
    const result = tastePlusScreens.find((element) => element.dataset.tastePlusScreen === 'result');
    const base = result?.querySelector('.taste-plus-result-base');
    if (base) base.src = './assets/taste-plus/result-start.png';
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => result?.classList.add('is-animating')));
    tastePlusResultTimer = window.setTimeout(() => {
      if (base) base.src = './assets/taste-plus/result-final.png';
      result?.classList.add('is-complete');
    }, 1580);
  }
}

function getVisibleGiftProducts() {
  return giftProductData.filter((product) => {
    if (activeGiftCategory !== 'all' && product.category !== activeGiftCategory) return false;
    return activeGiftFilter === '전체' || product.filter === activeGiftFilter;
  });
}

function renderGiftSlots() {
  if (!giftSlots) return;
  giftSlots.replaceChildren();
  for (let index = 0; index < 4; index += 1) {
    const product = selectedGiftProducts[index];
    const slot = document.createElement('button');
    slot.className = 'gift-selected-slot';
    slot.type = 'button';
    slot.setAttribute('aria-label', product ? `${index + 1}번 ${product.name} 선택 해제` : `${index + 1}번 빈 선택 칸`);
    if (product) {
      slot.classList.add('is-filled');
      slot.dataset.giftRemove = product.id;
      const image = document.createElement('img');
      image.src = product.slotImage || product.image;
      image.alt = product.name;
      slot.append(image);
    } else {
      const number = document.createElement('span');
      number.textContent = String(index + 1);
      slot.append(number);
    }
    giftSlots.append(slot);
  }

  const selectionCount = selectedGiftProducts.length;
  giftSelectionStatus.textContent = selectionCount === 4 ? '4/4 선택 완료' : `${selectionCount}/4 선택`;
  giftReserveButton.disabled = selectionCount !== 4;
}

function renderGiftFilters() {
  if (!giftFiltersView) return;
  giftFiltersView.replaceChildren();
  const filters = giftCategoryFilters[activeGiftCategory] || [];
  giftFiltersView.hidden = filters.length === 0;
  filters.forEach((filter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = filter;
    button.dataset.giftFilter = filter;
    button.classList.toggle('is-active', filter === activeGiftFilter);
    giftFiltersView.append(button);
  });
}

function renderGiftProducts() {
  if (!giftProductsView) return;
  giftProductsView.replaceChildren();
  getVisibleGiftProducts().forEach((product) => {
    const selectedIndex = selectedGiftProducts.findIndex((item) => item.id === product.id);
    const card = document.createElement('button');
    card.className = 'gift-product-card';
    card.classList.toggle('is-selected', selectedIndex >= 0);
    card.type = 'button';
    card.dataset.giftProduct = product.id;
    card.setAttribute('aria-pressed', String(selectedIndex >= 0));
    card.innerHTML = `<span class="gift-product-image"><img src="${product.image}" alt="${product.name}"></span>
      <small>${product.type}</small><strong>${product.name}</strong><p>${product.note}</p>
      <span class="gift-product-check" aria-hidden="true">${selectedIndex >= 0 ? selectedIndex + 1 : '✓'}</span>`;
    giftProductsView.append(card);
  });
}

function renderGiftOrder() {
  giftCategoryButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.giftCategory === activeGiftCategory));
  renderGiftSlots();
  renderGiftFilters();
  renderGiftProducts();
}

function renderGiftScreen(screen) {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  giftFlowView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view');
  phoneShell.classList.add('is-gift-view');
  closePairingModal();
  closeGiftReserveModal();
  giftFlowScreens.forEach((element) => { element.hidden = element.dataset.giftScreen !== screen; });
  if (screen === 'order') renderGiftOrder();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function cardVisualMarkup(card) {
  return `<span class="pick-card-visual pick-card-visual--${card.tone}">
    <strong>${card.title}</strong>
    <small>${card.tagline}</small>
    <span class="pick-card-symbol" aria-hidden="true"></span>
    <em>카드의 뒷면을 확인하세요</em>
  </span>`;
}

function wrapCardIndex(index) {
  const count = cardPickCards.length;
  return ((index % count) + count) % count;
}

function shortestCardOffset(index, position = cardWheelPosition) {
  const count = cardPickCards.length;
  let offset = (((index - position) % count) + count) % count;
  if (offset > count / 2) offset -= count;
  return offset;
}

function renderCardArc(animate = true) {
  if (!cardArc) return;
  if (cardArc.children.length !== cardPickCards.length) {
    cardArc.replaceChildren();
    cardPickCards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'card-arc-item';
      button.dataset.cardIndex = String(index);
      button.innerHTML = cardVisualMarkup(card);
      cardArc.append(button);
    });
  }
  cardArc.classList.toggle('is-animating', animate);
  Array.from(cardArc.children).forEach((button, index) => {
    const card = cardPickCards[index];
    const offset = shortestCardOffset(index);
    const angle = offset * 19;
    const radians = angle * (Math.PI / 180);
    const x = Math.sin(radians) * 250;
    const y = (1 - Math.cos(radians)) * 250;
    const rotation = angle * 0.62;
    const scale = Math.max(0.74, 1 - Math.abs(offset) * 0.045);
    const isCurrent = Math.abs(offset) < 0.12;
    const isSelected = selectedCardIndex === index && isCurrent;
    button.style.setProperty('--wheel-x', `${x.toFixed(2)}px`);
    button.style.setProperty('--wheel-y', `${(y + (isSelected ? -24 : 0)).toFixed(2)}px`);
    button.style.setProperty('--wheel-rotation', `${rotation.toFixed(2)}deg`);
    button.style.setProperty('--wheel-scale', String(isSelected ? scale * 1.18 : scale));
    button.style.setProperty('--wheel-opacity', String(Math.max(0, Math.min(1, 3.35 - Math.abs(offset)))));
    button.style.zIndex = String(Math.max(1, 50 - Math.round(Math.abs(offset) * 10) + (isSelected ? 20 : 0)));
    button.classList.toggle('is-current', isCurrent);
    button.classList.toggle('is-selected', isSelected);
    button.classList.toggle('is-outside', Math.abs(offset) > 3.35);
    button.setAttribute('aria-label', `${card.title} 카드${isCurrent ? ', 현재 선택 위치' : ''}`);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  cardArcStage?.classList.toggle('has-selection', selectedCardIndex !== null);
  cardWheelDecoration?.style.setProperty('--wheel-turn', `${(-cardWheelPosition * 19).toFixed(2)}deg`);
  cardPickConfirm.disabled = selectedCardIndex === null;
}

function moveCardArc(direction) {
  cardWheelPosition = Math.round(cardWheelPosition) + direction;
  activeCardIndex = wrapCardIndex(cardWheelPosition);
  selectedCardIndex = null;
  renderCardArc(true);
}

function selectWheelCard(index) {
  const offset = shortestCardOffset(index);
  cardWheelPosition += offset;
  activeCardIndex = index;
  selectedCardIndex = index;
  renderCardArc(true);
}

function updateResultCard() {
  const card = cardPickCards[selectedCardIndex ?? activeCardIndex];
  resultFront.innerHTML = cardVisualMarkup(card);
  resultBack.dataset.tone = card.tone;
  resultTitle.textContent = card.title;
  resultTagline.textContent = card.tagline;
  resultFlipScene.classList.remove('is-flipped');
  resultFlipScene.setAttribute('aria-pressed', 'false');
  resultFlipScene.setAttribute('aria-label', `${card.title} 카드를 뒤집어 오늘의 술 확인하기`);
}

function renderCardPickScreen(screen) {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  clearTimeout(analysisTimer);
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideGiftFlow();
  cardPickView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view');
  phoneShell.classList.add('is-card-pick-view');
  closePairingModal();
  cardPickScreens.forEach((element) => { element.hidden = element.dataset.cardPickScreen !== screen; });
  if (screen === 'cards') renderCardArc();
  if (screen === 'reveal') updateResultCard();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderCatalog(category) {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  const data = catalogData[category];
  const isSupported = Boolean(data);

  homeView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  catalogView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view');
  closePairingModal();
  catalogView.setAttribute('aria-label', isSupported ? `${data.label} 탐색` : '기타주류 탐색');

  catalogCategoryLinks.forEach((link) => {
    const selected = link.dataset.category === category;
    link.classList.toggle('is-selected', selected);
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  catalogFilters.replaceChildren();
  catalogProducts.replaceChildren();

  if (!isSupported) {
    const empty = document.createElement('div');
    empty.className = 'catalog-empty';
    empty.innerHTML = '<strong>기타주류 화면은 준비 중입니다.</strong><span>디자인이 확정되면 같은 구조에 바로 연결할 수 있어요.</span>';
    catalogProducts.append(empty);
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  data.filters.forEach((filter) => {
    const button = document.createElement('button');
    button.className = 'catalog-filter';
    button.type = 'button';
    button.textContent = filter;
    button.setAttribute('role', 'listitem');
    button.addEventListener('click', () => {
      const wasSelected = button.classList.contains('is-selected');
      catalogFilters.querySelectorAll('.catalog-filter').forEach((item) => item.classList.remove('is-selected'));
      button.classList.toggle('is-selected', !wasSelected);
    });
    catalogFilters.append(button);
  });

  data.products.forEach((product, index) => catalogProducts.append(createProductCard(product, category, index)));
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function formatOldPrice(price) {
  const value = Number(price.replace(/[^0-9]/g, ''));
  return `${Math.round(value / 0.88 / 100) * 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
}

function closePairingModal() {
  if (!pairingModal) return;
  pairingModal.hidden = true;
}

function getResultShareData() {
  const cardIndex = selectedCardIndex ?? activeCardIndex;
  const card = cardPickCards[cardIndex];
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.delete('display');
  shareUrl.searchParams.delete('presentation');
  shareUrl.searchParams.delete('test');
  shareUrl.searchParams.set('resultCard', String(cardIndex));
  shareUrl.hash = '#card-pick/reveal';
  return {
    title: 'WINE25+ PLUS 오늘의 술',
    text: `${card.title} 카드가 추천한 오늘의 술은 디아블로 까베르네 소비뇽이에요.`,
    url: shareUrl.href,
    card,
  };
}

function closeResultShareModal() {
  if (!resultShareModal) return;
  resultShareModal.hidden = true;
  resultShareStatus.textContent = '';
}

function openResultShareModal() {
  if (!resultShareModal) return;
  const shareData = getResultShareData();
  resultShareCardTitle.textContent = shareData.card.title;
  resultShareUrl.textContent = shareData.url;
  resultShareStatus.textContent = '';
  resultShareModal.hidden = false;
  resultShareModal.querySelector('[data-result-share-action="native"]')?.focus();
}

async function copyShareText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('copy-failed');
}

function renderPairings(profile) {
  pairingRecommendations.replaceChildren();
  profile.pairings.forEach((pairing) => {
    const line = document.createElement('p');
    const name = document.createElement('strong');
    name.textContent = `${pairing.name} | `;
    line.append(name, pairing.description);
    pairingRecommendations.append(line);
  });
}

function renderProductDetail(category, index) {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  const data = catalogData[category];
  const product = data?.products[index];
  const profile = detailProfiles[category];
  if (!product || !profile) {
    renderHome();
    return;
  }

  activeDetail = { category, index, product, profile };
  homeView.hidden = true;
  catalogView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  detailView.hidden = false;
  phoneShell.classList.remove('is-account-view', 'is-cellar-view', 'is-drink-view');
  phoneShell.classList.add('is-detail-view');
  closePairingModal();

  detailImage.className = 'detail-product-image';
  if (product.imageClass) detailImage.classList.add(product.imageClass);
  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailEyebrow.textContent = profile.eyebrow;
  detailName.textContent = product.name;
  detailPrice.innerHTML = `${product.price.replace('원', '')}<small>원</small>`;
  detailDiscount.querySelector('strong').textContent = '12%';
  detailDiscount.querySelector('del').textContent = formatOldPrice(product.price);
  detailPickup.textContent = product.pickup.replace(' 부터 수령', '부터');
  detailView.setAttribute('aria-label', `${product.name} 상품 상세`);

  detailGauges.replaceChildren();
  profile.metrics.forEach((metric) => {
    const item = document.createElement('span');
    item.className = 'detail-gauge';
    item.textContent = metric.label;
    const track = document.createElement('span');
    track.className = 'detail-gauge-track';
    const fill = document.createElement('span');
    fill.className = 'detail-gauge-fill';
    fill.style.setProperty('--gauge-width', `${metric.value}%`);
    track.append(fill);
    item.append(track);
    detailGauges.append(item);
  });

  renderPairings(profile);
  window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      detailGauges.querySelectorAll('.detail-gauge-fill').forEach((fill) => fill.classList.add('is-animated'));
    });
  });
}

function renderHome() {
  hideTastePlus();
  hideFriendSelect();
  hideFriendMileage();
  hidePairingFinder();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  homeView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view');
  closePairingModal();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function applyMembershipTier(index) {
  const tierIndex = Math.max(0, Math.min(membershipTiers.length - 1, Number(index) || 0));
  const tier = membershipTiers[tierIndex];
  wineryView.style.setProperty('--membership-color', tier.color);
  wineryView.style.setProperty('--membership-accent', tier.accent);
  wineryView.style.setProperty('--membership-soft', tier.soft);
  membershipRange.style.setProperty('--membership-progress', `${(tierIndex / 3) * 100}%`);
  membershipName.textContent = tier.name;
  membershipMessage.innerHTML = tier.message;
  membershipLabels.forEach((label, labelIndex) => {
    label.classList.toggle('is-current', labelIndex === tierIndex);
  });
}

function renderWinery() {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  wineryView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-cellar-view', 'is-drink-view');
  phoneShell.classList.add('is-account-view');
  closePairingModal();
  applyMembershipTier(membershipRange.value);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderCellarSlots(category = 'all') {
  cellarGrid.replaceChildren();
  const visibleBottles = category === 'all' ? cellarBottles : cellarBottles.filter((bottle) => bottle.category === category);
  const totalSlots = 40;

  for (let index = 0; index < totalSlots; index += 1) {
    const slot = document.createElement('div');
    slot.className = 'cellar-slot';
    const bottle = visibleBottles[index];
    if (bottle) {
      const image = document.createElement('img');
      image.src = bottle.image;
      image.alt = bottle.label;
      slot.append(image);
    } else {
      slot.classList.add('cellar-slot--empty');
      slot.setAttribute('aria-label', '빈 술장 칸');
    }
    cellarGrid.append(slot);
  }
}

function renderCellar() {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  cellarView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-drink-view');
  phoneShell.classList.add('is-account-view', 'is-cellar-view');
  closePairingModal();
  const activeCategory = cellarTabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.dataset.cellarCategory || 'all';
  renderCellarSlots(activeCategory);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function classifyDrinkType() {
  const knowledge = surveyAnswers.slice(0, 3).reduce((sum, value) => sum + value, 0) >= 2;
  const explore = surveyAnswers.slice(3, 6).reduce((sum, value) => sum + value, 0) >= 2;
  const intensity = surveyAnswers.slice(6, 9).reduce((sum, value) => sum + value, 0) >= 2;

  if (!knowledge && !intensity) return explore ? 'curious-beginner' : 'comfort-cup';
  if (!knowledge && intensity) return explore ? 'bold-explorer' : 'straight-beginner';
  if (knowledge && !intensity) return explore ? 'light-explorer' : 'tipsy';
  return explore ? 'veteran' : 'drinker';
}

function createResultMetric(label, left, right, value) {
  const row = document.createElement('div');
  row.className = 'result-metric';
  row.innerHTML = `<strong>${label}</strong><span>${left}</span><span class="result-metric-track"><i style="--metric-value:${value}%"></i></span><span>${right}</span>`;
  return row;
}

function renderDrinkResultData() {
  const type = drinkTypes[activeDrinkType];
  drinkIdView.style.setProperty('--drink-color', type.color);
  drinkIdView.dataset.sommelier = type.sommelier;
  document.querySelectorAll('.result-title, .summary-title').forEach((element) => { element.textContent = type.name; });
  document.querySelectorAll('.result-tagline, .summary-tagline').forEach((element) => { element.textContent = type.tagline; });
  document.querySelectorAll('.result-shape, .summary-shape').forEach((image) => { image.src = type.shape; });
  document.querySelector('[data-sommelier-cta]').textContent = `${type.sommelier}와 대화하기 >`;
  document.querySelector('[data-ai-prompt-title]').textContent = `${type.sommelier}에게 물어보세요!`;
  document.querySelector('[data-ai-input]').placeholder = `${type.sommelier}에게 물어보기`;
  document.querySelectorAll('[data-ai-chat-name], [data-ai-chat-speaker]').forEach((element) => { element.textContent = type.sommelier; });

  resultMetrics.forEach((metrics) => metrics.replaceChildren(
    createResultMetric('주류 숙련도', '입문자', '애호가', type.knowledge ? 82 : 28),
    createResultMetric('탐색성', '새로움', '익숙함', type.explore ? 28 : 82),
    createResultMetric('선호 음용 강도', '가볍게', '강하게', type.intensity ? 82 : 28),
  ));
}

function renderSurveyQuestion() {
  surveyQuestion.textContent = drinkQuestions[surveyIndex];
  surveyCount.textContent = String(surveyIndex + 1);
  surveyProgress.style.setProperty('--survey-progress', `${((surveyIndex + 1) / drinkQuestions.length) * 100}%`);
}

function renderFriendCards() {
  const cards = [
    { name: '나영', type: '호기심 입문형', image: './assets/drink-id/type-blue.svg', color: '#2668ff' },
    { name: '수빈', type: '알딸딸형', image: './assets/drink-id/type-green.svg', color: '#459d47' },
    { name: '유민', type: '주류 고인물', image: './assets/drink-id/type-red.svg', color: '#f14b2f' },
    { name: '보연', type: '술맛 도전파', image: './assets/drink-id/type-yellow.svg', color: '#d4a800' },
  ];
  friendGrid.replaceChildren();
  cards.forEach((friend) => {
    const card = document.createElement('article');
    card.className = 'friend-card';
    card.style.setProperty('--friend-color', friend.color);
    card.innerHTML = `<img src="${friend.image}" alt=""><strong>${friend.name}</strong><span>${friend.type}</span>`;
    friendGrid.append(card);
  });
  const plus = document.createElement('button');
  plus.className = 'friend-card friend-card--plus';
  plus.type = 'button';
  plus.dataset.action = 'add-friend';
  plus.setAttribute('aria-label', '친구 추가');
  plus.innerHTML = '<img src="./assets/drink-id/type-plus.svg" alt="">';
  friendGrid.append(plus);
}

function renderDrinkScreen(screen) {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  clearTimeout(analysisTimer);
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  drinkIdView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view');
  phoneShell.classList.add('is-drink-view');
  phoneShell.classList.toggle('is-drink-figma-screenshot', ['analyzing', 'browse', 'friend-product'].includes(screen));
  phoneShell.classList.toggle('is-drink-browse', screen === 'browse');
  if (screen === 'browse') updateStandaloneChrome(drinkBrowseChrome, ['유형 둘러보기', 'result', false], 'drink-id');
  closePairingModal();

  drinkScreens.forEach((element) => { element.hidden = element.dataset.drinkScreen !== screen; });
  if (screen === 'survey') renderSurveyQuestion();
  if (screen === 'issued' || screen === 'result' || screen === 'friends' || screen === 'browse' || screen === 'ai') renderDrinkResultData();
  if (screen === 'ai-chat') {
    renderDrinkResultData();
    aiChatQuestion.textContent = activeAiQuestion;
  }
  if (screen === 'friends') renderFriendCards();
  if (screen === 'analyzing') {
    analysisTimer = window.setTimeout(() => {
      window.location.hash = '#drink-id/issued';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 1700);
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderSharedCartScreen(screen) {
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  clearTimeout(analysisTimer);
  clearTimeout(sharedCartTimer);
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideCardPick();
  hideGiftFlow();
  sharedCartView.hidden = false;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view');
  phoneShell.classList.add('is-shared-cart-view');
  phoneShell.classList.toggle('is-shared-cart-figma', ['chat', 'entry-loading', 'result-loading', 'result', 'product', 'cart'].includes(screen));
  phoneShell.classList.toggle('is-shared-cart-common-chrome', ['result', 'product', 'cart'].includes(screen));
  if (sharedCartChromeRules[screen]) updateStandaloneChrome(sharedCartChrome, sharedCartChromeRules[screen], 'shared-cart');
  closePairingModal();
  sharedCartScreens.forEach((element) => { element.hidden = element.dataset.sharedCartScreen !== screen; });
  if (screen === 'entry-loading') sharedCartTimer = window.setTimeout(() => { window.location.hash = '#shared-cart/survey'; }, 1050);
  if (screen === 'result-loading') sharedCartTimer = window.setTimeout(() => { window.location.hash = '#shared-cart/summary'; }, 1450);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderCellarmate(screen) {
  hideKyoboEvent();
  hideFindIt();
  clearTimeout(analysisTimer);
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  cellarmateView.hidden = false;
  cellarmateCouponModal.hidden = true;
  cellarmateScreens.forEach((element) => { element.hidden = element.dataset.cellarmateScreen !== screen; });
  if (screen === 'received' || screen === 'sent') {
    cellarmateScreens.forEach((element) => { element.hidden = element.dataset.cellarmateScreen !== 'received'; });
    cellarmateTabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.cellarmateTab === screen)));
    cellarmatePanels.forEach((panel) => { panel.hidden = panel.dataset.cellarmatePanel !== screen; });
  }
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view', 'is-shared-cart-view', 'is-card-pick-view', 'is-gift-view');
  phoneShell.classList.add('is-cellarmate-view');
  closePairingModal();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderKyoboEvent(screen) {
  hideFindIt();
  clearTimeout(analysisTimer);
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  hideCellarmate();
  kyoboEventView.hidden = false;
  updateStandaloneChrome(kyoboChrome, kyoboChromeRules[screen], 'kyobo');
  kyoboScreens.forEach((element) => { element.hidden = element.dataset.kyoboScreen !== screen; });
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view', 'is-shared-cart-view', 'is-card-pick-view', 'is-gift-view', 'is-cellarmate-view');
  phoneShell.classList.add('is-kyobo-view');
  closePairingModal();
  kyoboEventView.scrollTo({ top: 0, behavior: 'auto' });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function updateFindItGame() {
  const isComplete = foundTreasures.size === 4;
  findItGameImage.src = isComplete ? './assets/find-it/game-complete.png' : './assets/find-it/game-start.png';
  findItGameImage.alt = isComplete ? '네 가지 보물을 모두 찾은 완성 화면' : '와인, 샌드위치, 디저트, 셔벗 네 가지 보물찾기';
  findItPieceVisuals.forEach((visual) => {
    visual.classList.toggle('is-found', !isComplete && foundTreasures.has(visual.dataset.findPieceVisual));
  });
  findItTargets.forEach((target) => {
    const isFound = foundTreasures.has(target.dataset.findPiece);
    target.classList.toggle('is-found', isFound);
    target.disabled = isFound;
  });
  findItCount.textContent = String(foundTreasures.size);
}

function renderFindIt(screen) {
  clearTimeout(analysisTimer);
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  hideCellarmate();
  hideKyoboEvent();
  findItView.hidden = false;
  updateStandaloneChrome(findItChrome, findItChromeRules[screen], 'find-it');
  findItScreens.forEach((element) => { element.hidden = element.dataset.findItScreen !== screen; });
  findItCompleteModal.hidden = true;
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view', 'is-shared-cart-view', 'is-card-pick-view', 'is-gift-view', 'is-cellarmate-view', 'is-kyobo-view');
  phoneShell.classList.add('is-find-it-view');
  closePairingModal();
  if (screen === 'game') updateFindItGame();
  findItView.scrollTo({ top: 0, behavior: 'auto' });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderWorldTour(screen) {
  clearTimeout(analysisTimer);
  window.clearTimeout(worldTourLoadingTimer);
  worldTourLoadingTimer = 0;
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  worldTourView.hidden = false;
  worldTourView.dataset.activeScreen = screen;
  updateStandaloneChrome(worldTourChrome, worldTourChromeRules[screen], 'world-tour');
  worldTourScreens.forEach((element) => { element.hidden = element.dataset.worldTourScreen !== screen; });
  const worldProductGauges = worldTourView.querySelector('.world-product-gauges');
  worldProductGauges?.classList.remove('is-animated');
  if (screen === 'product') {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => worldProductGauges?.classList.add('is-animated')));
  }
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view', 'is-shared-cart-view', 'is-card-pick-view', 'is-gift-view', 'is-cellarmate-view', 'is-kyobo-view', 'is-find-it-view');
  phoneShell.classList.add('is-world-tour-view');
  closePairingModal();
  worldTourView.scrollTo({ top: 0, behavior: 'auto' });
  window.scrollTo({ top: 0, behavior: 'auto' });
  window.requestAnimationFrame(() => {
    worldTourView.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  if (screen === 'modetour-loading') {
    worldTourLoadingTimer = window.setTimeout(() => {
      window.location.hash = '#world-tour/modetour-detail';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 1300);
  }
}

function renderPartyQuest(screen) {
  window.clearTimeout(partyQuestLoadingTimer);
  partyQuestLoadingTimer = 0;
  homeView.hidden = true;
  catalogView.hidden = true;
  detailView.hidden = true;
  wineryView.hidden = true;
  cellarView.hidden = true;
  drinkIdView.hidden = true;
  hideSharedCart();
  hideCardPick();
  hideGiftFlow();
  hideCellarmate();
  hideKyoboEvent();
  hideFindIt();
  hideWorldTour();
  hidePairingFinder();
  closePartyQuestModals();
  partyQuestView.hidden = false;
  partyQuestView.classList.toggle('is-exact-figma-screen', ['quest', 'cart', 'pickup', 'camera', 'shot', 'complete'].includes(screen));
  partyQuestScreens.forEach((element) => { element.hidden = element.dataset.partyScreen !== screen; });
  updateStandaloneChrome(partyQuestChrome, partyQuestChromeRules[screen], 'party-quest');
  phoneShell.classList.remove('is-detail-view', 'is-account-view', 'is-cellar-view', 'is-drink-view', 'is-shared-cart-view', 'is-card-pick-view', 'is-gift-view', 'is-cellarmate-view', 'is-kyobo-view', 'is-find-it-view', 'is-world-tour-view', 'is-pairing-finder-view');
  phoneShell.classList.add('is-party-quest-view');
  partyQuestView.scrollTop = 0;
  window.scrollTo({ top:0, behavior:'auto' });
  if (screen === 'loading') {
    partyQuestLoadingTimer = window.setTimeout(() => {
      window.location.hash = '#party-quest/card';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 1350);
  }
  if (screen === 'pickup') {
    partyQuestView.querySelectorAll('.party-bubbles p').forEach((bubble) => {
      bubble.style.animation = 'none';
      bubble.offsetHeight;
      bubble.style.animation = '';
    });
  }
}

function syncViewFromHash() {
  const partyQuestMatch = window.location.hash.match(/^#party-quest\/(home|calendar|theme|loading|card|quest|cart|pickup|camera|shot|complete)$/);
  if (partyQuestMatch) {
    renderPartyQuest(partyQuestMatch[1]);
    return;
  }
  hidePartyQuest();
  const pairingFinderMatch = window.location.hash.match(/^#pairing-finder\/(list|detail)$/);
  if (pairingFinderMatch) {
    renderPairingFinder(pairingFinderMatch[1]);
    return;
  }
  hidePairingFinder();
  if (window.location.hash === '#friend-mileage') {
    renderFriendMileage();
    return;
  }
  hideFriendMileage();
  if (window.location.hash === '#friend-select') {
    renderFriendSelect();
    return;
  }
  hideFriendSelect();
  const tastePlusMatch = window.location.hash.match(/^#taste-plus\/(home|survey-1|survey-7|loading|result|custom-home)$/);
  if (tastePlusMatch) {
    renderTastePlus(tastePlusMatch[1]);
    return;
  }
  hideTastePlus();
  const worldTourMatch = window.location.hash.match(/^#world-tour\/(world|japan|niigata|product|reserve|coupon|travel-all|travel-wine|travel-sake|modetour-loading|modetour-detail)$/);
  if (worldTourMatch) {
    renderWorldTour(worldTourMatch[1]);
    return;
  }
  hideWorldTour();
  const findItMatch = window.location.hash.match(/^#find-it\/(game|coupon)$/);
  if (findItMatch) {
    renderFindIt(findItMatch[1]);
    return;
  }
  const kyoboMatch = window.location.hash.match(/^#kyobo\/(event|instagram|linktree)$/);
  if (kyoboMatch) {
    renderKyoboEvent(kyoboMatch[1]);
    return;
  }
  const cellarmateMatch = window.location.hash.match(/^#cellarmate\/(received|detail|sent|sent-friends|sent-products|sent-preview|sent-complete)$/);
  if (cellarmateMatch) {
    renderCellarmate(cellarmateMatch[1]);
    return;
  }
  const giftMatch = window.location.hash.match(/^#gift\/(event|order|complete|pickup)$/);
  if (giftMatch) {
    renderGiftScreen(giftMatch[1]);
    return;
  }
  const cardPickMatch = window.location.hash.match(/^#card-pick\/(category|cards|reveal)$/);
  if (cardPickMatch) {
    if (cardPickMatch[1] === 'reveal') {
      const sharedCardValue = new URLSearchParams(window.location.search).get('resultCard');
      const sharedCardIndex = Number(sharedCardValue);
      if (sharedCardValue !== null && Number.isInteger(sharedCardIndex) && cardPickCards[sharedCardIndex]) {
        selectedCardIndex = sharedCardIndex;
        activeCardIndex = sharedCardIndex;
        cardWheelPosition = sharedCardIndex;
      }
    }
    renderCardPickScreen(cardPickMatch[1]);
    return;
  }
  const sharedCartMatch = window.location.hash.match(/^#shared-cart\/(create|chat|entry-loading|survey|result-loading|summary|result|product|cart)$/);
  if (sharedCartMatch) {
    renderSharedCartScreen(sharedCartMatch[1]);
    return;
  }
  const drinkMatch = window.location.hash.match(/^#drink-id\/(start|survey|analyzing|issued|result|friends|friend-product|browse|ai|ai-chat)$/);
  if (drinkMatch) {
    renderDrinkScreen(drinkMatch[1]);
    return;
  }
  if (window.location.hash === '#winery') {
    renderWinery();
    return;
  }
  if (window.location.hash === '#cellar') {
    renderCellar();
    return;
  }
  const productMatch = window.location.hash.match(/^#product\/(wine|beer|liquor|highball)\/(\d+)$/);
  if (productMatch) {
    renderProductDetail(productMatch[1], Number(productMatch[2]));
    return;
  }
  const match = window.location.hash.match(/^#catalog\/(wine|beer|liquor|highball|other)$/);
  if (match) renderCatalog(match[1]);
  else renderHome();
}

window.addEventListener('hashchange', syncViewFromHash);
window.addEventListener('load', () => window.scrollTo({ top: 0, behavior: 'auto' }));
syncViewFromHash();

membershipRange?.addEventListener('input', () => applyMembershipTier(membershipRange.value));

cellarmateTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.cellarmateTab;
    if (selected === 'sent') {
      window.location.hash = '#cellarmate/sent';
      return;
    }
    cellarmateTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    cellarmatePanels.forEach((panel) => { panel.hidden = panel.dataset.cellarmatePanel !== selected; });
  });
});

document.querySelectorAll('[data-cellarmate-go]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!button.disabled) window.location.hash = `#cellarmate/${button.dataset.cellarmateGo}`;
  });
});

document.querySelectorAll('[data-cellarmate-friend]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('[data-cellarmate-friend-image]').src = './assets/cellarmate-sent/friend-selected.png';
    document.querySelector('[data-cellarmate-next-friend]').disabled = false;
  });
});

document.querySelector('.cellarmate-friend-stage')?.addEventListener('click', (event) => {
  const next = document.querySelector('[data-cellarmate-next-friend]');
  const stage = event.currentTarget;
  if (next.disabled || event.target.closest('[data-cellarmate-friend]')) return;
  const bounds = stage.getBoundingClientRect();
  if (event.clientY - bounds.top >= bounds.height * 0.6) {
    window.location.hash = '#cellarmate/sent-products';
  }
});

document.querySelector('[data-cellarmate-product]')?.addEventListener('click', () => {
  document.querySelector('[data-cellarmate-product-image]').src = './assets/cellarmate-sent/product-selected.png';
  document.querySelector('.cellarmate-product-next').disabled = false;
});

document.querySelector('[data-cellarmate-open="detail"]')?.addEventListener('click', () => {
  window.location.hash = '#cellarmate/detail';
});

document.querySelectorAll('[data-cellarmate-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.cellarmateBack;
    window.location.hash = destination === 'home' ? '#top' : destination === 'winery' ? '#winery' : `#cellarmate/${destination}`;
  });
});

document.querySelector('[data-cellarmate-coupon-open]')?.addEventListener('click', () => {
  cellarmateCouponModal.hidden = false;
  cellarmateCouponModal.querySelector('[data-cellarmate-coupon-close]')?.focus();
});

document.querySelectorAll('[data-cellarmate-coupon-close]').forEach((button) => {
  button.addEventListener('click', () => { cellarmateCouponModal.hidden = true; });
});

document.querySelectorAll('[data-kyobo-go]').forEach((button) => {
  button.addEventListener('click', () => { window.location.hash = `#kyobo/${button.dataset.kyoboGo}`; });
});

document.querySelectorAll('[data-kyobo-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.kyoboBack;
    window.location.hash = destination === 'home' ? '#top' : `#kyobo/${destination}`;
  });
});

document.querySelectorAll('[data-world-tour-go]').forEach((button) => {
  button.addEventListener('click', () => {
    button.blur();
    window.location.hash = `#world-tour/${button.dataset.worldTourGo}`;
  });
});

document.querySelectorAll('[data-world-tour-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.worldTourBack;
    window.location.hash = destination === 'home' ? '#top' : `#world-tour/${destination}`;
  });
});

findItTargets.forEach((target) => {
  target.addEventListener('click', () => {
    if (foundTreasures.has(target.dataset.findPiece)) return;
    foundTreasures.add(target.dataset.findPiece);
    updateFindItGame();
    if (foundTreasures.size === 4) {
      window.setTimeout(() => {
        findItCompleteModal.hidden = false;
        findItCompleteModal.querySelector('.find-it-coupon-button')?.focus();
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 420);
    }
  });
});

document.querySelectorAll('[data-find-it-go]').forEach((button) => {
  button.addEventListener('click', () => { window.location.hash = `#find-it/${button.dataset.findItGo}`; });
});

document.querySelectorAll('[data-find-it-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.findItBack;
    window.location.hash = destination === 'home' ? '#top' : `#find-it/${destination}`;
  });
});

document.querySelectorAll('[data-find-complete-close]').forEach((button) => {
  button.addEventListener('click', () => { findItCompleteModal.hidden = true; });
});

if (kyoboProductCarousel) {
  let pointerId = null;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;
  let suppressClick = false;

  kyoboProductCarousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = kyoboProductCarousel.scrollLeft;
    moved = false;
  });

  kyoboProductCarousel.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const delta = event.clientX - startX;
    if (!moved && Math.abs(delta) < 6) return;
    moved = true;
    kyoboProductCarousel.classList.add('is-dragging');
    kyoboProductCarousel.setPointerCapture?.(pointerId);
    kyoboProductCarousel.scrollLeft = startScrollLeft - delta;
    event.preventDefault();
  });

  const finishKyoboDrag = (event) => {
    if (event.pointerId !== pointerId) return;
    if (moved) {
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 80);
    }
    kyoboProductCarousel.classList.remove('is-dragging');
    if (kyoboProductCarousel.hasPointerCapture?.(pointerId)) kyoboProductCarousel.releasePointerCapture(pointerId);
    pointerId = null;
  };

  kyoboProductCarousel.addEventListener('pointerup', finishKyoboDrag);
  kyoboProductCarousel.addEventListener('pointercancel', finishKyoboDrag);
  kyoboProductCarousel.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cellarmateCouponModal && !cellarmateCouponModal.hidden) cellarmateCouponModal.hidden = true;
  if (event.key === 'Escape' && findItCompleteModal && !findItCompleteModal.hidden) findItCompleteModal.hidden = true;
});

giftCategoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeGiftCategory = button.dataset.giftCategory;
    activeGiftFilter = giftCategoryFilters[activeGiftCategory]?.[0] || '전체';
    renderGiftOrder();
  });
});

giftFiltersView?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-gift-filter]');
  if (!button) return;
  activeGiftFilter = button.dataset.giftFilter;
  renderGiftFilters();
  renderGiftProducts();
});

giftProductsView?.addEventListener('click', (event) => {
  const card = event.target.closest('[data-gift-product]');
  if (!card) return;
  const product = giftProductData.find((item) => item.id === card.dataset.giftProduct);
  if (!product) return;
  const selectedIndex = selectedGiftProducts.findIndex((item) => item.id === product.id);
  if (selectedIndex >= 0) selectedGiftProducts.splice(selectedIndex, 1);
  else if (selectedGiftProducts.length < 4) selectedGiftProducts.push(product);
  else {
    showToast('기프트 세트에는 네 종류까지 담을 수 있어요.');
    return;
  }
  renderGiftSlots();
  renderGiftProducts();
});

giftSlots?.addEventListener('click', (event) => {
  const slot = event.target.closest('[data-gift-remove]');
  if (!slot) return;
  selectedGiftProducts = selectedGiftProducts.filter((product) => product.id !== slot.dataset.giftRemove);
  renderGiftSlots();
  renderGiftProducts();
});

document.querySelectorAll('[data-gift-go]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.hash = `#gift/${button.dataset.giftGo}`;
  });
});

document.querySelectorAll('[data-gift-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.giftBack;
    window.location.hash = destination === 'home' ? '#top' : `#gift/${destination}`;
  });
});

giftReserveButton?.addEventListener('click', () => {
  if (selectedGiftProducts.length !== 4) return;
  giftQuantity = 1;
  giftQuantityValue.textContent = '1';
  giftTotalPrice.textContent = '28,500';
  giftReserveModal.hidden = false;
  phoneShell.classList.add('is-gift-modal-open');
});

document.querySelectorAll('[data-gift-close-modal]').forEach((button) => button.addEventListener('click', closeGiftReserveModal));

document.querySelectorAll('[data-gift-quantity]').forEach((button) => {
  button.addEventListener('click', () => {
    giftQuantity = button.dataset.giftQuantity === 'plus' ? Math.min(9, giftQuantity + 1) : Math.max(1, giftQuantity - 1);
    giftQuantityValue.textContent = String(giftQuantity);
    giftTotalPrice.textContent = (28500 * giftQuantity).toLocaleString('ko-KR');
  });
});

document.querySelector('[data-gift-confirm]')?.addEventListener('click', () => {
  closeGiftReserveModal();
  window.location.hash = '#gift/complete';
});

document.querySelector('[data-gift-open-pickup]')?.addEventListener('click', () => {
  window.location.hash = '#gift/pickup';
});

cardCategoryOptions.forEach((option) => {
  option.addEventListener('click', () => {
    activeCardCategory = option.dataset.cardCategory;
    cardCategoryOptions.forEach((item) => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-checked', String(selected));
    });
    cardCategoryNext.disabled = false;
    cardCategoryNext.textContent = `${cardCategoryLabels[activeCardCategory]}으로 오늘의 술 뽑기`;
  });
});

cardCategoryNext?.addEventListener('click', () => {
  if (!activeCardCategory) return;
  selectedCardIndex = null;
  window.location.hash = '#card-pick/cards';
});

document.querySelectorAll('[data-card-pick-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.cardPickBack;
    window.location.hash = destination === 'home' ? '#top' : `#card-pick/${destination}`;
  });
});

cardArc?.addEventListener('click', (event) => {
  if (suppressCardClick) return;
  if (cardPointerMoved) {
    cardPointerMoved = false;
    return;
  }
  const cardButton = event.target.closest('[data-card-index]');
  if (!cardButton) return;
  selectWheelCard(Number(cardButton.dataset.cardIndex));
});

function settleCardWheel(animate = true) {
  cardWheelPosition = Math.round(cardWheelPosition);
  activeCardIndex = wrapCardIndex(cardWheelPosition);
  selectedCardIndex = null;
  renderCardArc(animate);
}

function startCardInertia(pointerVelocityX) {
  const startPosition = cardWheelPosition;
  const wheelVelocity = -pointerVelocityX / 92;
  const travel = Math.max(-1.65, Math.min(1.65, wheelVelocity * 170));

  if (Math.abs(travel) < 0.12 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settleCardWheel(true);
    return;
  }

  const targetPosition = startPosition + travel;
  const duration = Math.min(460, 290 + (Math.abs(travel) * 90));
  const startedAt = performance.now();
  cardArcStage?.classList.add('is-coasting');

  function coastFrame(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - ((1 - progress) ** 3);
    cardWheelPosition = startPosition + ((targetPosition - startPosition) * eased);
    activeCardIndex = wrapCardIndex(Math.round(cardWheelPosition));
    renderCardArc(false);

    if (progress < 1) {
      cardInertiaFrame = requestAnimationFrame(coastFrame);
      return;
    }

    cardInertiaFrame = null;
    cardArcStage?.classList.remove('is-coasting');
    settleCardWheel(true);
  }

  cardInertiaFrame = requestAnimationFrame(coastFrame);
}

cardArcStage?.addEventListener('pointerdown', (event) => {
  if (cardInertiaFrame !== null) {
    cancelAnimationFrame(cardInertiaFrame);
    cardInertiaFrame = null;
  }
  cardArcStage.classList.remove('is-coasting');
  cardPointerStartX = event.clientX;
  cardDragStartPosition = cardWheelPosition;
  cardPointerMoved = false;
  cardLastPointerX = event.clientX;
  cardLastPointerTime = performance.now();
  cardVelocityX = 0;
  const pressedCard = event.target.closest('[data-card-index]');
  cardPointerCardIndex = pressedCard ? Number(pressedCard.dataset.cardIndex) : null;
  selectedCardIndex = null;
  cardArcStage.classList.add('is-dragging');
  cardArcStage.setPointerCapture?.(event.pointerId);
});

cardArcStage?.addEventListener('pointermove', (event) => {
  if (!cardArcStage.classList.contains('is-dragging')) return;
  const now = performance.now();
  const elapsed = Math.max(1, now - cardLastPointerTime);
  const instantVelocity = (event.clientX - cardLastPointerX) / elapsed;
  cardVelocityX = (cardVelocityX * 0.58) + (instantVelocity * 0.42);
  cardLastPointerX = event.clientX;
  cardLastPointerTime = now;
  const totalDelta = event.clientX - cardPointerStartX;
  if (Math.abs(totalDelta) > 8) cardPointerMoved = true;
  cardWheelPosition = cardDragStartPosition - (totalDelta / 92);
  activeCardIndex = wrapCardIndex(Math.round(cardWheelPosition));
  renderCardArc(false);
});

function finishCardDrag(event) {
  if (!cardArcStage?.classList.contains('is-dragging')) return;
  cardArcStage.classList.remove('is-dragging');
  cardArcStage.releasePointerCapture?.(event.pointerId);
  if (cardPointerMoved) {
    const idleTime = Math.max(0, performance.now() - cardLastPointerTime);
    const releaseVelocity = event.type === 'pointercancel'
      ? 0
      : cardVelocityX * Math.max(0, 1 - (idleTime / 120));
    startCardInertia(releaseVelocity);
  } else if (cardPointerCardIndex !== null) {
    selectWheelCard(cardPointerCardIndex);
    suppressCardClick = true;
    window.setTimeout(() => { suppressCardClick = false; }, 0);
  }
  cardPointerCardIndex = null;
}

cardArcStage?.addEventListener('pointerup', finishCardDrag);
cardArcStage?.addEventListener('pointercancel', finishCardDrag);
cardArcStage?.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveCardArc(event.key === 'ArrowRight' ? 1 : -1);
});

cardPickConfirm?.addEventListener('click', () => {
  if (selectedCardIndex === null) return;
  window.location.hash = '#card-pick/reveal';
});

resultFlipScene?.addEventListener('click', () => {
  const flipped = resultFlipScene.classList.toggle('is-flipped');
  resultFlipScene.setAttribute('aria-pressed', String(flipped));
  resultFlipScene.setAttribute('aria-label', flipped ? '카드 앞면 다시 보기' : '카드를 뒤집어 오늘의 술 확인하기');
});

document.querySelectorAll('[data-card-share]').forEach((button) => {
  button.addEventListener('click', openResultShareModal);
});

document.querySelectorAll('[data-close-result-share]').forEach((button) => {
  button.addEventListener('click', closeResultShareModal);
});

document.querySelectorAll('[data-result-share-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const shareData = getResultShareData();
    const action = button.dataset.resultShareAction;
    resultShareStatus.textContent = '';

  try {
      if (action === 'native') {
        if (navigator.share) {
          await navigator.share({ title: shareData.title, text: shareData.text, url: shareData.url });
          closeResultShareModal();
        } else {
          await copyShareText(`${shareData.text}\n${shareData.url}`);
          resultShareStatus.textContent = '공유 문구를 복사했어요. 카카오톡 등에 붙여넣어 주세요.';
        }
      } else if (action === 'copy-result') {
        await copyShareText(`${shareData.text}\n${shareData.url}`);
        resultShareStatus.textContent = '결과 문구와 링크를 복사했어요.';
      } else if (action === 'copy-link') {
        await copyShareText(shareData.url);
        resultShareStatus.textContent = '링크를 복사했어요.';
      }
    } catch (error) {
      if (error?.name !== 'AbortError') resultShareStatus.textContent = '공유하지 못했어요. 다시 시도해 주세요.';
    }
  });
});

document.querySelectorAll('[data-route-back]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.hash = window.location.hash === '#cellar' ? '#winery' : '#top';
  });
});

cellarTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    cellarTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    renderCellarSlots(tab.dataset.cellarCategory);
    document.querySelector('.cellar-shelf-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-drink-go]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.drinkGo;
    if (destination === 'survey') {
      surveyIndex = 0;
      surveyAnswers = [];
    }
    window.location.hash = `#drink-id/${destination}`;
  });
});

document.querySelectorAll('[data-survey-answer]').forEach((button) => {
  button.addEventListener('click', () => {
    surveyAnswers[surveyIndex] = Number(button.dataset.surveyAnswer);
    if (surveyIndex < drinkQuestions.length - 1) {
      surveyIndex += 1;
      renderSurveyQuestion();
      return;
    }
    activeDrinkType = classifyDrinkType();
    window.location.hash = '#drink-id/analyzing';
  });
});

document.querySelectorAll('[data-drink-retake]').forEach((button) => button.addEventListener('click', () => {
  surveyIndex = 0;
  surveyAnswers = [];
  window.location.hash = '#drink-id/survey';
}));

document.querySelectorAll('[data-drink-back]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.hash = button.dataset.drinkBack === 'home' ? '#top' : `#drink-id/${button.dataset.drinkBack}`;
  });
});

document.querySelectorAll('[data-shared-cart-go]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.sharedCartGo;
    if (destination === 'summary') {
      const requiredChoices = ['knowledge', 'proof', 'taste', 'mood'];
      if (requiredChoices.some((group) => !sharedCartChoices[group])) {
        showToast('각 항목에서 취향을 하나씩 선택해주세요.');
        return;
      }
    }
    window.location.hash = destination === 'summary' ? '#shared-cart/result-loading' : `#shared-cart/${destination}`;
  });
});

document.querySelectorAll('[data-shared-cart-back]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = button.dataset.sharedCartBack;
    window.location.hash = destination === 'home' ? '#top' : `#shared-cart/${destination}`;
  });
});

document.querySelectorAll('[data-shared-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.dataset.sharedChoice;
    sharedCartChoices[group] = button.dataset.choiceValue;
    document.querySelectorAll(`[data-shared-choice="${group}"]`).forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  });
});

meetingInput?.addEventListener('input', () => {
  meetingCount.textContent = `${Array.from(meetingInput.value).length}/30`;
});

document.querySelector('[data-copy-shared-link]')?.addEventListener('click', async () => {
  const link = `${window.location.origin}${window.location.pathname}${window.location.search}#shared-cart/survey`;
  try {
    await navigator.clipboard.writeText(link);
    showToast('초대 링크를 복사했어요.');
  } catch {
    showToast('초대 링크: w25plus/dainhouse123');
  }
});

document.querySelectorAll('.ai-suggestions button').forEach((button) => {
  button.addEventListener('click', () => {
    activeAiQuestion = button.dataset.aiQuestion;
    window.location.hash = '#drink-id/ai-chat';
  });
});

document.querySelector('[data-ai-send]')?.addEventListener('click', () => {
  const input = document.querySelector('[data-ai-input]');
  if (!input.value.trim()) return;
  activeAiQuestion = input.value.trim();
  input.value = '';
  window.location.hash = '#drink-id/ai-chat';
});

document.querySelector('[data-ai-chat-send]')?.addEventListener('click', () => {
  const input = document.querySelector('[data-ai-chat-input]');
  const message = input.value.trim();
  if (!message) return;
  const bubble = document.createElement('div');
  bubble.className = 'ai-chat-message ai-chat-message--user';
  bubble.textContent = message;
  aiChatMessages.append(bubble);
  input.value = '';
  bubble.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  showToast(`${drinkTypes[activeDrinkType].sommelier}가 답변을 준비하고 있어요.`);
});

pairingTrigger?.addEventListener('click', () => {
  if (!activeDetail) return;
  pairingModal.hidden = false;
  pairingModal.querySelector('.pairing-close')?.focus();
});

document.querySelectorAll('[data-close-pairing]').forEach((button) => button.addEventListener('click', closePairingModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resultShareModal.hidden) {
    closeResultShareModal();
    document.querySelector('[data-card-share]')?.focus();
    return;
  }
  if (event.key === 'Escape' && !pairingModal.hidden) {
    closePairingModal();
    pairingTrigger?.focus();
  }
});

if (carousel) {
  const track = carousel.querySelector('.hero-track');
  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const currentLabel = carousel.querySelector('[data-carousel-current]');
  const liveLabel = carousel.querySelector('[data-carousel-live]');
  const previousButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const openButton = carousel.querySelector('[data-carousel-open]');
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
  let dragPointerId = null;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let pointerDidDrag = false;
  let suppressCarouselClick = false;

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
    const activeAction = slides[carouselIndex]?.dataset.slideAction;
    openButton.hidden = !activeAction;
    openButton.dataset.action = activeAction || '';

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
    if (!suppressCarouselClick) moveCarousel(-1);
  });

  nextButton.addEventListener('click', () => {
    if (!suppressCarouselClick) moveCarousel(1);
  });

  carousel.addEventListener('click', (event) => {
    if (!suppressCarouselClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  carousel.addEventListener('pointerdown', (event) => {
    if (isMoving || (event.pointerType === 'mouse' && event.button !== 0)) return;

    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    pointerDidDrag = false;
    clearInterval(autoplayTimer);
  });

  carousel.addEventListener('pointermove', (event) => {
    if (event.pointerId !== dragPointerId) return;

    dragDeltaX = event.clientX - dragStartX;
    if (!pointerDidDrag && Math.abs(dragDeltaX) < 6) return;

    if (!pointerDidDrag) carousel.setPointerCapture?.(event.pointerId);
    pointerDidDrag = true;
    carousel.classList.add('is-dragging');
    track.style.transition = 'none';
    track.style.transform = `translateX(calc(-${trackPosition * 100}% + ${dragDeltaX}px))`;
    event.preventDefault();
  });

  function finishCarouselDrag(event) {
    if (event.pointerId !== dragPointerId) return;

    if (carousel.hasPointerCapture?.(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }
    dragPointerId = null;
    carousel.classList.remove('is-dragging');
    track.style.transition = '';

    if (!pointerDidDrag) {
      startAutoplay();
      return;
    }

    suppressCarouselClick = true;
    const swipeThreshold = Math.min(52, carousel.clientWidth * 0.14);
    if (Math.abs(dragDeltaX) >= swipeThreshold) {
      moveCarousel(dragDeltaX > 0 ? -1 : 1);
    } else {
      setTrackPosition(trackPosition);
      startAutoplay();
    }

    window.setTimeout(() => {
      suppressCarouselClick = false;
      pointerDidDrag = false;
    }, 360);
  }

  carousel.addEventListener('pointerup', finishCarouselDrag);
  carousel.addEventListener('pointercancel', finishCarouselDrag);

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

const storyCarousel = document.querySelector('.story-carousel');

if (storyCarousel) {
  const storyTrack = storyCarousel.querySelector('.story-track');
  const storySlides = Array.from(storyCarousel.querySelectorAll('.story-slide'));
  const storyLive = storyCarousel.querySelector('[data-story-live]');
  const previousButton = storyCarousel.querySelector('[data-story-prev]');
  const nextButton = storyCarousel.querySelector('[data-story-next]');
  const openButton = storyCarousel.querySelector('[data-story-open]');
  const count = storySlides.length;
  const firstClone = storySlides[0].cloneNode(true);
  const lastClone = storySlides[count - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  storyTrack.prepend(lastClone);
  storyTrack.append(firstClone);

  let index = 0;
  let position = 1;
  let pointerId = null;
  let startX = 0;
  let deltaX = 0;
  let didDrag = false;
  let suppressClick = false;
  let moving = false;
  let fallback;

  function setPosition(nextPosition, animate = true) {
    if (!animate) storyTrack.style.transition = 'none';
    storyTrack.style.transform = `translateX(-${nextPosition * 100}%)`;
    if (!animate) {
      storyTrack.getBoundingClientRect();
      storyTrack.style.transition = '';
    }
  }

  function updateStoryState() {
    storyLive.textContent = `${index + 1}번째 취향 콘텐츠`;
    openButton.dataset.action = storySlides[index]?.dataset.storyAction || '';
    storySlides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== index));
    });
  }

  function finishStoryMove() {
    clearTimeout(fallback);
    if (position === 0) {
      position = count;
      setPosition(position, false);
    } else if (position === count + 1) {
      position = 1;
      setPosition(position, false);
    }
    moving = false;
  }

  function moveStory(direction) {
    if (moving) return;
    moving = true;
    index = (index + direction + count) % count;
    position += direction;
    updateStoryState();
    setPosition(position);
    fallback = window.setTimeout(finishStoryMove, 520);
  }

  storyTrack.addEventListener('transitionend', (event) => {
    if (event.target === storyTrack && event.propertyName === 'transform') finishStoryMove();
  });

  previousButton.addEventListener('click', () => {
    if (!suppressClick) moveStory(-1);
  });

  nextButton.addEventListener('click', () => {
    if (!suppressClick) moveStory(1);
  });

  storyCarousel.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  storyCarousel.addEventListener('pointerdown', (event) => {
    if (moving || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    deltaX = 0;
    didDrag = false;
  });

  storyCarousel.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    deltaX = event.clientX - startX;
    if (!didDrag && Math.abs(deltaX) < 6) return;
    if (!didDrag) storyCarousel.setPointerCapture?.(event.pointerId);
    didDrag = true;
    storyCarousel.classList.add('is-dragging');
    storyTrack.style.transition = 'none';
    storyTrack.style.transform = `translateX(calc(-${position * 100}% + ${deltaX}px))`;
    event.preventDefault();
  });

  function finishStoryDrag(event) {
    if (event.pointerId !== pointerId) return;
    if (storyCarousel.hasPointerCapture?.(event.pointerId)) storyCarousel.releasePointerCapture(event.pointerId);
    pointerId = null;
    storyCarousel.classList.remove('is-dragging');
    storyTrack.style.transition = '';
    if (!didDrag) return;
    suppressClick = true;
    if (Math.abs(deltaX) >= Math.min(52, storyCarousel.clientWidth * 0.14)) {
      moveStory(deltaX > 0 ? -1 : 1);
    } else {
      setPosition(position);
    }
    window.setTimeout(() => { suppressClick = false; didDrag = false; }, 360);
  }

  storyCarousel.addEventListener('pointerup', finishStoryDrag);
  storyCarousel.addEventListener('pointercancel', finishStoryDrag);
  storyCarousel.addEventListener('dragstart', (event) => event.preventDefault());
  setPosition(position, false);
  updateStoryState();
}

if (friendCarousel) {
  let pointerId = null;
  let pointerStartX = 0;
  let scrollStart = 0;
  let dragged = false;
  let scrollTimer = 0;

  function nearestFriendIndex() {
    const center = friendCarousel.scrollLeft + (friendCarousel.clientWidth / 2);
    return friendCards.reduce((nearest, card, index) => {
      const distance = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  }

  function settleFriendCarousel() {
    setActiveFriend(nearestFriendIndex(), true);
  }

  friendCarousel.addEventListener('scroll', () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(settleFriendCarousel, 90);
  }, { passive: true });

  friendCards.forEach((card, index) => card.addEventListener('click', () => {
    if (!dragged) setActiveFriend(index, true);
  }));

  friendCarousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    scrollStart = friendCarousel.scrollLeft;
    dragged = false;
    friendCarousel.classList.add('is-grabbing');
  });

  friendCarousel.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const distance = event.clientX - pointerStartX;
    if (!dragged && Math.abs(distance) < 5) return;
    dragged = true;
    friendCarousel.setPointerCapture?.(event.pointerId);
    friendCarousel.scrollLeft = scrollStart - distance;
    event.preventDefault();
  });

  function finishFriendDrag(event) {
    if (event.pointerId !== pointerId) return;
    if (friendCarousel.hasPointerCapture?.(event.pointerId)) friendCarousel.releasePointerCapture(event.pointerId);
    pointerId = null;
    friendCarousel.classList.remove('is-grabbing');
    if (dragged) {
      settleFriendCarousel();
      window.setTimeout(() => { dragged = false; }, 180);
    }
  }

  friendCarousel.addEventListener('pointerup', finishFriendDrag);
  friendCarousel.addEventListener('pointercancel', finishFriendDrag);
  friendCarousel.addEventListener('dragstart', (event) => event.preventDefault());
}

document.querySelector('[data-friend-select-back]')?.addEventListener('click', () => { window.location.hash = '#top'; });
document.querySelector('[data-friend-mileage-back]')?.addEventListener('click', () => { window.location.hash = '#top'; });
friendMileageMissions.forEach((mission) => {
  mission.addEventListener('click', () => {
    const missionId = mission.dataset.friendMission;
    if (!missionId || completedFriendMissions.has(missionId)) return;
    completedFriendMissions.add(missionId);
    mission.classList.add('is-completing');
    mission.style.setProperty('--mission-progress', '100%');
    window.setTimeout(() => {
      mission.classList.remove('is-completing');
      mission.classList.add('is-complete');
      const status = mission.querySelector('small');
      if (status) status.textContent = 'clear!';
      if (completedFriendMissions.size === friendMileageMissions.length) {
        window.setTimeout(showFriendGift, 420);
      }
    }, 420);
    updateFriendMileage();
  });
});
document.querySelectorAll('[data-friend-gift-close]').forEach((button) => button.addEventListener('click', closeFriendGift));
resetFriendMileage();
document.querySelector('[data-pairing-finder-back]')?.addEventListener('click', () => {
  window.location.hash = window.location.hash === '#pairing-finder/detail' ? '#pairing-finder/list' : '#top';
});
document.querySelector('[data-pairing-finder-home]')?.addEventListener('click', () => { window.location.hash = '#top'; });
document.querySelectorAll('[data-pairing-finder-go]').forEach((button) => button.addEventListener('click', () => {
  window.location.hash = `#pairing-finder/${button.dataset.pairingFinderGo}`;
}));
document.querySelectorAll('.pairing-vote-controls button').forEach((button) => button.addEventListener('click', () => {
  const nextPressed = button.getAttribute('aria-pressed') !== 'true';
  document.querySelectorAll('.pairing-vote-controls button').forEach((option) => option.setAttribute('aria-pressed', 'false'));
  button.setAttribute('aria-pressed', String(nextPressed));
}));
document.querySelector('[data-friend-confirm]')?.addEventListener('click', () => {
  applySelectedFriend();
  window.location.hash = '#top';
  window.setTimeout(openFriendEvent, 80);
});
document.querySelectorAll('[data-friend-event-close]').forEach((button) => button.addEventListener('click', closeFriendEvent));

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
  'shared-cart-next': '공동 주문 상품 선택 화면은 다음 단계에서 연결됩니다.',
  'drink-id': 'MY DRINK ID 화면으로 연결됩니다.',
  'hero-find': '와인 찾기와 쿠폰 이벤트를 준비 중입니다.',
  'hero-kyobo': '음주 독서 인증 이벤트를 준비 중입니다.',
  'kyobo-product-later': '구매 페이지는 다음 단계에서 기존 상품 상세와 연결할 예정입니다.',
  'world-trip': '세계 주류 여행 콘텐츠를 준비 중입니다.',
  'pairing-finder': '맛잘알 조합 찾기를 준비 중입니다.',
  'party-quest': '파티 퀘스트를 준비 중입니다.',
  store: '픽업 매장을 변경할 수 있습니다.',
  menu: '전체 메뉴를 준비 중입니다.',
  share: '상품 공유 기능을 준비 중입니다.',
  reserve: '예약 주문 기능을 준비 중입니다.',
  settings: '와이너리 설정 화면을 준비 중입니다.',
  'grade-info': '등급별 혜택 안내를 준비 중입니다.',
  orders: '주문내역 화면을 준비 중입니다.',
  'gift-cards': '상품권 화면을 준비 중입니다.',
  mileage: '마일리지 화면을 준비 중입니다.',
  restock: '재입고 알림 화면을 준비 중입니다.',
  'pickup-all': '픽업 예정 주류를 모두 보여드립니다.',
  recommended: '주류 추천 화면을 준비 중입니다.',
  'cellar-filter': '술장 필터를 준비 중입니다.',
  'cellar-sort': '술장 정렬 방식을 준비 중입니다.',
  'cellar-mate': '셀러메이트 화면을 준비 중입니다.',
  'cellarmate-sort': '셀러를 최신순으로 정렬했어요.',
  'cellarmate-recommend': '친구에게 추천할 셀러를 준비할게요.',
  'cellarmate-cart': '추천 주류를 장바구니에 담았어요.',
  'cellarmate-coupon-library': '쿠폰함에 쿠폰을 저장했어요.',
  'friends-cellar': '친구 술장 화면을 준비 중입니다.',
  'add-friend': '새 친구를 추가할 수 있습니다.',
  'write-post': '새 커뮤니티 글을 작성할 수 있습니다.',
  'world-order-detail': '키쿠스이 준마이 주문 상세를 확인했어요.',
};

document.querySelectorAll('[data-taste-plus-go]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.hash = `#taste-plus/${button.dataset.tastePlusGo}`;
  });
});

document.querySelectorAll('[data-taste-plus-back]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.hash = `#taste-plus/${button.dataset.tastePlusBack}`;
  });
});

document.querySelector('[data-taste-plus-exit]')?.addEventListener('click', () => {
  window.location.hash = '#top';
});

window.addEventListener('message', (event) => {
  if (event.source !== window.parent || event.data?.type !== 'w25-toggle-taste-plus') return;
  window.location.hash = window.location.hash.startsWith('#taste-plus/') ? '#top' : '#taste-plus/home';
});

const partyDays = document.querySelector('[data-party-days]');
if (partyDays) {
  const leading = 2;
  for (let index = 0; index < leading; index += 1) partyDays.append(document.createElement('span'));
  for (let day = 1; day <= 30; day += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(day);
    button.classList.toggle('is-today', day === 9);
    button.setAttribute('aria-label', `9월 ${day}일 선택`);
    button.addEventListener('click', () => {
      partyDays.querySelectorAll('button').forEach((item) => item.classList.toggle('is-selected', item === button));
      window.setTimeout(() => { window.location.hash = '#party-quest/theme'; }, 180);
    });
    partyDays.append(button);
  }
}

document.querySelectorAll('[data-party-go]').forEach((button) => button.addEventListener('click', () => {
  window.location.hash = `#party-quest/${button.dataset.partyGo}`;
}));

partyQuestScreens.filter((screen) => screen.classList.contains('party-exact-screen')).forEach((screen) => {
  const homeButton = document.createElement('button');
  homeButton.className = 'party-brand-home';
  homeButton.type = 'button';
  homeButton.setAttribute('aria-label', 'WINE25 PLUS 홈으로 이동');
  homeButton.addEventListener('click', () => { window.location.hash = '#top'; });
  screen.append(homeButton);
});

document.querySelectorAll('.party-theme-options button').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('is-selected');
  button.setAttribute('aria-pressed', String(button.classList.contains('is-selected')));
  const selected = document.querySelectorAll('.party-theme-options button.is-selected');
  if (selected.length > 2) {
    selected[0].classList.remove('is-selected');
    selected[0].setAttribute('aria-pressed', 'false');
  }
  if (document.querySelectorAll('.party-theme-options button.is-selected').length === 2) {
    window.setTimeout(() => { window.location.hash = '#party-quest/loading'; }, 320);
  }
}));

function openPartyModal(name) {
  closePartyQuestModals();
  const modal = partyQuestView?.querySelector(`[data-party-modal="${name}"]`);
  if (!modal) return;
  modal.hidden = false;
  modal.querySelector('button:not(.party-modal-backdrop)')?.focus();
}

document.querySelector('[data-party-share]')?.addEventListener('click', () => openPartyModal('share'));
document.querySelectorAll('[data-party-share-complete]').forEach((button) => button.addEventListener('click', () => {
  window.location.hash = '#party-quest/quest';
}));
document.querySelector('[data-party-qr]')?.addEventListener('click', () => openPartyModal('qr'));
document.querySelector('[data-party-qr-complete]')?.addEventListener('click', () => openPartyModal('pickup'));
document.querySelector('[data-party-shutter]')?.addEventListener('click', () => {
  window.location.hash = '#party-quest/shot';
  window.setTimeout(() => openPartyModal('capture'), 420);
});
document.querySelector('[data-party-capture-complete]')?.addEventListener('click', () => { window.location.hash = '#party-quest/complete'; });
document.querySelectorAll('[data-party-modal-close]').forEach((button) => button.addEventListener('click', closePartyQuestModals));
document.querySelectorAll('[data-party-memory]').forEach((button) => button.addEventListener('click', () => {
  const isMovie = button.dataset.partyMemory === 'movie';
  const modal = partyQuestView.querySelector('[data-party-modal="memory"]');
  modal.querySelector('[data-party-memory-icon]').textContent = isMovie ? '🎬' : '📚';
  modal.querySelector('[data-party-memory-title]').textContent = isMovie ? '영이' : '민지';
  modal.querySelector('[data-party-memory-status]').textContent = isMovie ? '대기중' : '픽업 완료';
  modal.querySelector('[data-party-memory-copy]').innerHTML = isMovie
    ? 'GS 망원점<br>프레시넷 꼬든 네그로 브뤼 픽업'
    : 'GS 효창점<br>파티 글라스 4개입 기획 세트 픽업';
  modal.querySelector('[data-party-memory-time]').textContent = isMovie ? '미완료' : '18:04';
  modal.querySelector('[data-party-memory-note]').textContent = isMovie ? '...' : '꽤 무게가 나감! --,, 들고오는데 좀 힘들었어 ~';
  modal.querySelector('.party-memory-dialog').classList.toggle('is-book', !isMovie);
  openPartyModal('memory');
}));

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  if (action === 'profile') {
    window.location.hash = '#winery';
    return;
  }
  if (action === 'hero-find') {
    foundTreasures.clear();
    window.location.hash = '#find-it/game';
    return;
  }
  if (action === 'hero-kyobo') {
    window.location.hash = '#kyobo/event';
    return;
  }
  if (action === 'world-trip') {
    window.location.hash = '#world-tour/world';
    return;
  }
  if (action === 'pairing-finder') {
    window.location.hash = '#pairing-finder/list';
    return;
  }
  if (action === 'party-quest') {
    window.location.hash = '#party-quest/home';
    return;
  }
  if (action === 'cellar-mate') {
    window.location.hash = '#cellarmate/received';
    return;
  }
  if (action === 'cellarmate-coupon-library') {
    cellarmateCouponModal.hidden = true;
    showToast(messages[action]);
    return;
  }
  if (action === 'drink-id') {
    window.location.hash = '#drink-id/start';
    return;
  }
  if (action === 'drink-friends') {
    window.location.hash = '#friend-select';
    return;
  }
  if (action === 'friend-mileage') {
    window.location.hash = '#friend-mileage';
    return;
  }
  if (action === 'world-open-fridge') {
    window.location.hash = '#cellar';
    return;
  }
  if (action === 'story') {
    window.location.hash = '#story';
    return;
  }
  if (action === 'shared-cart') {
    window.location.hash = '#shared-cart/create';
    return;
  }
  if (action === 'gift-event') {
    activeGiftCategory = 'all';
    activeGiftFilter = '전체';
    selectedGiftProducts = [];
    giftQuantity = 1;
    window.location.hash = '#gift/event';
    return;
  }
  if (action === 'card-pick') {
    activeCardCategory = '';
    activeCardIndex = 1;
    cardWheelPosition = 1;
    cardDragStartPosition = 1;
    selectedCardIndex = null;
    cardCategoryOptions.forEach((option) => {
      option.classList.remove('is-selected');
      option.setAttribute('aria-checked', 'false');
    });
    cardCategoryNext.disabled = true;
    cardCategoryNext.textContent = '카테고리를 선택하세요';
    window.location.hash = '#card-pick/category';
    return;
  }
  if (action === 'home') {
    if (!homeView.hidden) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#top';
    }
    return;
  }

  showToast(messages[action] ?? '준비 중인 기능입니다.');
});
