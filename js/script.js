// FAQ アコーディオン
document.querySelectorAll('.faq-item__q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});
