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
  cart: '공동 장바구니에 2개 상품이 있습니다.',
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
