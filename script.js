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

    answer.style.display = 'none';
    question.style.cursor = 'pointer';

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq-open');

      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('faq-open');
        otherItem.querySelector('.faq-answer').style.display = 'none';
      });

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

    const messageBox = document.createElement('p');
    messageBox.style.marginTop = '1rem';
    messageBox.style.fontSize = '0.9rem';
    messageBox.style.fontWeight = '600';
    messageBox.style.textAlign = 'center';
    requestForm.appendChild(messageBox);

    requestForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const nameValue = nameInput.value.trim();
      const phoneValue = phoneInput.value.trim();

      if (nameValue === '' || phoneValue === '') {
        messageBox.textContent = 'Пожалуйста, заполните имя и телефон.';
        messageBox.style.color = '#B3261E';
        return;
      }

      messageBox.textContent = 'Спасибо! Ваша заявка отправлена, мы скоро свяжемся с вами.';
      messageBox.style.color = '#55694C';

      requestForm.reset();

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


  /* ============================================
     4. КАРУСЕЛЬ ОТЗЫВОВ — стрелки, свайп, автопрокрутка
     ============================================ */

  const track = document.querySelector('.reviews-track');
  const arrowLeft = document.querySelector('.carousel-arrow-left');
  const arrowRight = document.querySelector('.carousel-arrow-right');

  if (track && arrowLeft && arrowRight) {

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Определяем ширину "шага" прокрутки: ширина одной карточки + отступ
    function getStep() {
      const firstCard = track.querySelector('.review-card');
      if (!firstCard) return track.clientWidth;

      const cardStyle = window.getComputedStyle(firstCard.parentElement);
      const gap = parseFloat(cardStyle.columnGap || cardStyle.gap || '0') || 0;

      return firstCard.getBoundingClientRect().width + gap;
    }

    function isAtEnd() {
      // небольшой запас в 2px на погрешности округления
      return track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }

    function scrollNext() {
      if (isAtEnd()) {
        // плавный возврат к первому отзыву
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getStep(), behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    }

    arrowRight.addEventListener('click', function () {
      scrollNext();
      registerInteraction();
    });

    arrowLeft.addEventListener('click', function () {
      scrollPrev();
      registerInteraction();
    });

    /* ---------- Автопрокрутка ---------- */

    let idleTimer = null;
    let autoplayInterval = null;

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    function startAutoplay() {
      if (prefersReducedMotion) return; // не запускаем при reduced motion
      stopAutoplay();
      autoplayInterval = setInterval(scrollNext, 5000);
    }

    function resetIdleTimer() {
      if (idleTimer) clearTimeout(idleTimer);
      stopAutoplay();

      if (prefersReducedMotion) return;

      idleTimer = setTimeout(startAutoplay, 10000);
    }

    function registerInteraction() {
      // Любое ручное действие — сбрасываем и перезапускаем отсчёт бездействия
      resetIdleTimer();
    }

    if (!prefersReducedMotion) {
      // Клик по стрелкам уже вызывает registerInteraction() выше

      // Свайп / ручная прокрутка колесом или пальцем
      track.addEventListener('scroll', registerInteraction);
      track.addEventListener('touchstart', registerInteraction, { passive: true });

      // Наведение курсора — держим автопрокрутку остановленной, пока курсор внутри
      track.addEventListener('mouseenter', function () {
        if (idleTimer) clearTimeout(idleTimer);
        stopAutoplay();
      });

      track.addEventListener('mouseleave', function () {
        resetIdleTimer();
      });

      // Запускаем первый отсчёт бездействия при загрузке страницы
      resetIdleTimer();
    }
  }

});
