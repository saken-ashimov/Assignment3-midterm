// jQuery effects and interactive animations for both pages
$(function () {
  // 1. Caesar's interactive eyes (blink + Peace/War mood + famous quotes)
  const caesarQuotes = [
    '"Apes together strong." — Caesar (Rise, 2011)',
    '"Caesar is home." — Caesar in Muir Woods (Rise, 2011)',
    '"Apes do not want war, but will fight if we must." — Caesar (Dawn, 2014)',
    '"I always thought apes were better than humans. Now I see how much like them we are." — Caesar (Dawn, 2014)',
    '"I did not start this war. I offered you peace." — Caesar (War, 2017)'
  ];

  let quoteIndex = 0;

  function triggerCaesarEyes() {
    const $eyesWrap = $("#caesar-eyes");
    if ($eyesWrap.length === 0) {
      return;
    }

    quoteIndex = (quoteIndex + 1) % caesarQuotes.length;
    $eyesWrap.toggleClass("war-mode");

    const isWar = $eyesWrap.hasClass("war-mode");
    $("#btn-eye-mood").text(
      isWar ? "Switch to Peace Mode (Green Eyes)" : "Awaken War Mode (Amber Eyes)"
    );

    // Blink animation protected with .stop(true, true) against rapid clicks
    $eyesWrap
      .find(".eye")
      .stop(true, true)
      .animate({ opacity: 0.12 }, 110)
      .animate({ opacity: 1 }, 180);

    $("#eye-quote")
      .stop(true, true)
      .fadeOut(120, function () {
        $(this).text(caesarQuotes[quoteIndex]).fadeIn(220);
      });
  }

  $("#caesar-eyes, #btn-eye-mood").on("click", triggerCaesarEyes);

  // Subtle pupil tracking when moving the mouse in the hero section
  $(".hero").on("mousemove", function (event) {
    $(".pupil").each(function () {
      const $eye = $(this).parent();
      const offset = $eye.offset();
      const centerX = offset.left + $eye.outerWidth() / 2;
      const centerY = offset.top + $eye.outerHeight() / 2;

      const angle = Math.atan2(event.pageY - centerY, event.pageX - centerX);
      const maxMove = 10;
      const moveX = Math.round(Math.cos(angle) * maxMove);
      const moveY = Math.round(Math.sin(angle) * maxMove);

      $(this).css("transform", "translate(" + moveX + "px, " + moveY + "px)");
    });
  });

  $(".hero").on("mouseleave", function () {
    $(".pupil").css("transform", "translate(0px, 0px)");
  });

  // 2. Film card expandable details using slideToggle()
  $(".toggle-film-btn").on("click", function () {
    const $btn = $(this);
    const $extra = $btn.closest(".card-body").find(".film-extra");
    const isVisible = $extra.is(":visible");

    $extra.stop(true, true).slideToggle(240);
    $btn.text(isVisible ? "Show production notes ▾" : "Hide production notes ▴");
    $btn.attr("aria-expanded", String(!isVisible));
  });

  // 3. Custom FAQ Accordion using slideUp() and slideToggle()
  $(".faq-question").on("click", function () {
    const $btn = $(this);
    const $answer = $btn.closest(".faq-item").find(".faq-answer");
    const isOpen = $btn.hasClass("open");

    // Close all other answers smoothly
    $(".faq-question").not($btn).removeClass("open").attr("aria-expanded", "false");
    $(".faq-question").not($btn).find(".faq-icon").text("+");
    $(".faq-answer").not($answer).stop(true, true).slideUp(220);

    // Toggle clicked answer
    $btn.toggleClass("open", !isOpen).attr("aria-expanded", String(!isOpen));
    $btn.find(".faq-icon").text(isOpen ? "+" : "−");
    $answer.stop(true, true).slideToggle(220);
  });

  // 4. Film comparison spotlight on compare.html using fadeTo()
  $(".spotlight-btn").on("click", function () {
    const filmKey = $(this).attr("data-film");

    $(".spotlight-btn").removeClass("active");
    $(this).addClass("active");

    const $steps = $(".path-step");
    const $rows = $(".film-table tbody tr");

    if (filmKey === "all") {
      $steps.removeClass("spotlight-match").stop(true, true).fadeTo(220, 1);
      $rows.removeClass("spotlight-match").stop(true, true).fadeTo(220, 1);
      return;
    }

    $steps.each(function () {
      const isMatch = $(this).attr("data-film") === filmKey;
      $(this)
        .toggleClass("spotlight-match", isMatch)
        .stop(true, true)
        .fadeTo(220, isMatch ? 1 : 0.35);
    });

    $rows.each(function () {
      const isMatch = $(this).attr("data-film") === filmKey;
      $(this)
        .toggleClass("spotlight-match", isMatch)
        .stop(true, true)
        .fadeTo(220, isMatch ? 1 : 0.35);
    });
  });

  // 5. Card hover lift & smooth scroll with Back-to-Top button
  $(".film-card").on("mouseenter", function () {
    $(this).stop(true, false).animate({ top: "-6px" }, 160);
  });

  $(".film-card").on("mouseleave", function () {
    $(this).stop(true, false).animate({ top: "0px" }, 160);
  });

  const $sectionLinks = $('.site-nav .nav-link[href^="#"]');
  const spySectionIds = ["#home", "#cast", "#films", "#faq"];

  function updateScrollSpy() {
    if ($sectionLinks.length === 0 || $("#cast").length === 0) {
      return;
    }

    const scrollPos = $(window).scrollTop() + 140;
    const atBottom = $(window).scrollTop() + $(window).height() >= $(document).height() - 40;
    let activeId = "#home";

    if (atBottom) {
      activeId = "#faq";
    } else {
      for (let i = 0; i < spySectionIds.length; i++) {
        const $sec = $(spySectionIds[i]);
        if ($sec.length > 0 && scrollPos >= $sec.offset().top) {
          activeId = spySectionIds[i];
        }
      }
    }

    $sectionLinks.removeClass("active").removeAttr("aria-current");
    $sectionLinks.filter('[href="' + activeId + '"]').addClass("active").attr("aria-current", "location");
  }

  $('a[href^="#"]').on("click", function (event) {
    const targetId = $(this).attr("href");
    const $target = $(targetId);
    if ($target.length > 0) {
      event.preventDefault();
      if ($(this).hasClass("nav-link") && $sectionLinks.length > 0 && $("#cast").length > 0) {
        $sectionLinks.removeClass("active").removeAttr("aria-current");
        $(this).addClass("active").attr("aria-current", "location");
      }
      $("html, body")
        .stop(true, false)
        .animate({ scrollTop: $target.offset().top - 72 }, 420);
    }
  });

  const $topBtn = $("#back-to-top");

  $(window).on("scroll", function () {
    updateScrollSpy();

    if ($(this).scrollTop() > 300) {
      if (!$topBtn.is(":visible")) {
        $topBtn.stop(true, true).fadeIn(200);
      }
    } else {
      if ($topBtn.is(":visible")) {
        $topBtn.stop(true, true).fadeOut(200);
      }
    }
  });

  updateScrollSpy();

  $topBtn.on("click", function () {
    $("html, body").stop(true, false).animate({ scrollTop: 0 }, 420);
  });

  // 6. Auto-close mobile navbar on section link click or tap outside .site-nav
  function closeMobileMenu() {
    const menuEl = document.querySelector("#menu");
    if (!menuEl || !menuEl.classList.contains("show")) {
      return;
    }
    if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
      bootstrap.Collapse.getOrCreateInstance(menuEl).hide();
    } else {
      $(menuEl).removeClass("show");
      $(".navbar-toggler").addClass("collapsed").attr("aria-expanded", "false");
    }
  }

  $(".site-nav .nav-link").on("click", closeMobileMenu);

  $(document).on("click", function (event) {
    if ($("#menu").hasClass("show") && $(event.target).closest(".site-nav").length === 0) {
      closeMobileMenu();
    }
  });
});
