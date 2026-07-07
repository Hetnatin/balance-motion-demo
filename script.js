/* ===========================================
   BALANCE MOTION — script.js
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     1. FAQ — раскрытие/скрытие ответов по клику
     ============================================ */

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // По умолчанию ответы скрыты
    answer.style.display = 'none';

    question.style.cursor = 'pointer';

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq-open');

      // Сначала закрываем все вопросы...
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('faq-open');
        otherItem.querySelector('.faq-answer').style.display = 'none';
      });

      // ...затем открываем текущий, если он был закрыт
      if (!isOpen) {
        item.classList.add('faq-open');
        answer.style.display = 'block';
      }
    });
  });


  /* ============================================
     2. Форма записи — проверка, сообщение, очистка
     ============================================ */

  const requestForm = document.querySelector('.request-form form');

  if (requestForm) {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');

    // Контейнер для сообщений — создаём один раз
    const messageBox = document.createElement('p');
    messageBox.style.marginTop = '1rem';
    messageBox.style.fontSize = '0.9rem';
    messageBox.style.fontWeight = '600';
    messageBox.style.textAlign = 'center';
    requestForm.appendChild(messageBox);

    requestForm.addEventListener('submit', function (event) {
      event.preventDefault(); // не отправляем форму по-настоящему

      const nameValue = nameInput.value.trim();
      const phoneValue = phoneInput.value.trim();

      if (nameValue === '' || phoneValue === '') {
        messageBox.textContent = 'Пожалуйста, заполните имя и телефон.';
        messageBox.style.color = '#B3261E';
        return;
      }

      // Заявка "успешно отправлена" (демо-режим, без реальной отправки)
      messageBox.textContent = 'Спасибо! Ваша заявка отправлена, мы скоро свяжемся с вами.';
      messageBox.style.color = '#55694C';

      requestForm.reset();

      // Сообщение исчезает через несколько секунд
      setTimeout(function () {
        messageBox.textContent = '';
      }, 5000);
    });
  }


  /* ============================================
     3. Плавная прокрутка к якорям (с учётом шапки)
     ============================================ */

  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});