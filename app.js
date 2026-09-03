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
const resultMetrics = document.querySelector('.result-metrics');
const friendGrid = document.querySelector('.friend-grid');
const aiChatQuestion = document.querySelector('[data-ai-chat-question]');
const aiChatMessages = document.querySelector('.ai-chat-messages');
const sharedCartView = document.querySelector('.shared-cart-page');
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
  { name: 'Rookie', color: '#2f7c32', accent: '#1f6c24', soft: '#abc7ab', message: '다음 등급까지 <strong>150,000원</strong> 남았어요!' },
  { name: 'Mania', color: '#d7ac00', accent: '#b68f00', soft: '#f0dda8', message: '다음 등급까지 <strong>350,000원</strong> 남았어요!' },
  { name: 'Sommelier', color: '#d81810', accent: '#bf100a', soft: '#e9b7b9', message: '다음 등급까지 <strong>700,000원</strong> 남았어요!' },
  { name: 'Master', color: '#126bbb', accent: '#07599e', soft: '#aec9dd', message: '<strong>최고 등급</strong>을 달성했어요!' },
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
  'comfort-cup': { name: '편안한 찻잔형', tagline: '익숙한 한 잔을 천천히 즐기는 타입', color: '#2668ff', shape: './assets/drink-id/type-blue.svg', sommelier: '무무씨', knowledge: false, explore: false, intensity: false },
  'straight-beginner': { name: '직진 입문형', tagline: '선명한 취향을 향해 곧장 가는 타입', color: '#f0c517', shape: './assets/drink-id/type-yellow.svg', sommelier: '안드레씨', knowledge: false, explore: false, intensity: true },
  'bold-explorer': { name: '과감한 탐색형', tagline: '새로운 맛을 두려워하지 않는 도전자', color: '#f0c517', shape: './assets/drink-id/type-yellow.svg', sommelier: '안드레씨', knowledge: false, explore: true, intensity: true },
  tipsy: { name: '알딸딸형', tagline: '가볍고 기분 좋은 한 잔을 아는 타입', color: '#459d47', shape: './assets/drink-id/type-green.svg', sommelier: '순남씨', knowledge: true, explore: false, intensity: false },
  'light-explorer': { name: '가벼운 탐색가형', tagline: '부담 없이 새로운 맛을 즐기는 탐색가', color: '#459d47', shape: './assets/drink-id/type-green.svg', sommelier: '순남씨', knowledge: true, explore: true, intensity: false },
  drinker: { name: '주당형', tagline: '진하고 익숙한 한 잔을 즐기는 애호가', color: '#f15824', shape: './assets/drink-id/type-red.svg', sommelier: '머용씨', knowledge: true, explore: false, intensity: true },
  veteran: { name: '고인물 탐색형', tagline: '깊은 취향으로 낯선 술을 찾는 탐색가', color: '#f15824', shape: './assets/drink-id/type-red.svg', sommelier: '머용씨', knowledge: true, explore: true, intensity: true },
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
  sharedCartView.hidden = true;
  phoneShell.classList.remove('is-shared-cart-view');
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
  document.querySelectorAll('.result-title, .summary-title').forEach((element) => { element.textContent = type.name; });
  document.querySelectorAll('.result-tagline, .summary-tagline').forEach((element) => { element.textContent = type.tagline; });
  document.querySelectorAll('.result-shape, .summary-shape').forEach((image) => { image.src = type.shape; });
  document.querySelector('[data-sommelier-cta]').textContent = `${type.sommelier}와 대화하기 >`;
  document.querySelector('[data-ai-prompt-title]').textContent = `${type.sommelier}에게 물어보세요!`;
  document.querySelector('[data-ai-input]').placeholder = `${type.sommelier}에게 물어보기`;
  document.querySelectorAll('[data-ai-chat-name], [data-ai-chat-speaker]').forEach((element) => { element.textContent = type.sommelier; });

  resultMetrics.replaceChildren(
    createResultMetric('주류 숙련도', '입문자', '애호가', type.knowledge ? 82 : 28),
    createResultMetric('탐색성', '새로운', '익숙한', type.explore ? 28 : 82),
    createResultMetric('선호 음용 강도', '가볍게', '강하게', type.intensity ? 82 : 28),
  );
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
    { name: '유민', type: '주당형', image: './assets/drink-id/type-red.svg', color: '#f15824' },
    { name: '보연', type: '과감한 탐색형', image: './assets/drink-id/type-yellow.svg', color: '#d4a800' },
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
  closePairingModal();

  drinkScreens.forEach((element) => { element.hidden = element.dataset.drinkScreen !== screen; });
  if (screen === 'survey') renderSurveyQuestion();
  if (screen === 'result' || screen === 'friends' || screen === 'browse' || screen === 'ai') renderDrinkResultData();
  if (screen === 'ai-chat') {
    renderDrinkResultData();
    aiChatQuestion.textContent = activeAiQuestion;
  }
  if (screen === 'friends') renderFriendCards();
  if (screen === 'analyzing') {
    analysisTimer = window.setTimeout(() => {
      window.location.hash = '#drink-id/result';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 1700);
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderSharedCartScreen(screen) {
  clearTimeout(analysisTimer);
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
  closePairingModal();
  sharedCartScreens.forEach((element) => { element.hidden = element.dataset.sharedCartScreen !== screen; });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function syncViewFromHash() {
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
  const sharedCartMatch = window.location.hash.match(/^#shared-cart\/(create|survey|summary)$/);
  if (sharedCartMatch) {
    renderSharedCartScreen(sharedCartMatch[1]);
    return;
  }
  const drinkMatch = window.location.hash.match(/^#drink-id\/(start|survey|analyzing|result|friends|browse|ai|ai-chat)$/);
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

document.querySelector('[data-drink-retake]')?.addEventListener('click', () => {
  surveyIndex = 0;
  surveyAnswers = [];
  window.location.hash = '#drink-id/survey';
});

document.querySelectorAll('[data-drink-back]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.hash = button.dataset.drinkBack === 'home' ? '#top' : '#drink-id/result';
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
    window.location.hash = `#shared-cart/${destination}`;
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
    const giftEntry = carousel.querySelector('.carousel-gift-entry');
    const cardEntry = carousel.querySelector('.carousel-card-entry');
    if (giftEntry) giftEntry.hidden = carouselIndex !== 1;
    if (cardEntry) cardEntry.hidden = carouselIndex !== 2;

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
  'friends-cellar': '친구 술장 화면을 준비 중입니다.',
  'add-friend': '새 친구를 추가할 수 있습니다.',
  'write-post': '새 커뮤니티 글을 작성할 수 있습니다.',
};

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  const action = trigger.dataset.action;
  if (action === 'profile') {
    window.location.hash = '#winery';
    return;
  }
  if (action === 'drink-id') {
    window.location.hash = '#drink-id/start';
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
