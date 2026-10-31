/* =========================================================
   GaU QR Tour — page behaviour (no frameworks, no build step)
   1. Photo placeholders when an image file is missing
   2. Language switch (EN / SW / SO) with English fallback
   3. Share button (native share sheet, else copy link)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Photo placeholders ---------- */
  document.querySelectorAll(".photo img").forEach(function (img) {
    var mark = function () { img.closest(".photo").classList.add("is-missing"); };
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener("error", mark);
  });

  /* ---------- 2. Language switch ---------- */
  var dict = window.I18N || {};
  var buttons = document.querySelectorAll(".lang button");

  function t(lang, key) {
    return (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || null;
  }

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var text = t(lang, el.getAttribute("data-i18n"));
      if (text) el.textContent = text;
    });
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem("gau-lang", lang); } catch (e) { /* private mode */ }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });

  var saved = null;
  try { saved = localStorage.getItem("gau-lang"); } catch (e) {}
  if (saved && dict[saved]) setLang(saved);

  /* ---------- 3. Share ---------- */
  var shareBtn = document.getElementById("share-btn");
  var toast = document.getElementById("toast");

  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var url = location.origin + location.pathname;   // drop ?from=stone etc.
      var data = { title: document.title, text: "#ILoveGaU", url: url };

      if (navigator.share) {
        navigator.share(data).catch(function () { /* user cancelled */ });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var lang = document.documentElement.lang || "en";
          toast.textContent = t(lang, "spot.copied");
        });
      }
    });
  }

  /* ---------- 4. Hero slideshow ----------
     Crossfades between the board photos every 5 s.
     - Skips slides whose photo is missing.
     - Runs only when 2+ photos exist.
     - Starts paused if the visitor prefers reduced motion.
     - Pause/play button (WCAG 2.2.2: moving content must be pausable). */
  var slideBox = document.querySelector(".hero__slides");
  if (slideBox) {
    var slides = [].slice.call(slideBox.querySelectorAll(".slide"));
    var toggle = slideBox.querySelector(".slides__toggle");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var paused = !!reduce;
    var current = 0;
    var INTERVAL = 5000;

    var isMissing = function (s) { return s.classList.contains("is-missing"); };
    var available = function () { return slides.filter(function (s) { return !isMissing(s); }); };

    var show = function (i) {
      slides[current].classList.remove("is-active");
      current = i;
      slides[current].classList.add("is-active");
    };

    var next = function () {
      if (available().length < 2) return;
      var i = current;
      do { i = (i + 1) % slides.length; } while (isMissing(slides[i]));
      show(i);
    };

    var labelToggle = function () {
      var lang = document.documentElement.lang || "en";
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute("aria-label", t(lang, paused ? "hero.play" : "hero.pause"));
    };

    // Called whenever a photo loads or fails: fix the active slide, show/hide the button.
    var refresh = function () {
      var ok = available();
      if (isMissing(slides[current]) && ok.length) show(slides.indexOf(ok[0]));
      toggle.hidden = ok.length < 2;
    };

    slides.forEach(function (s) {
      var img = s.querySelector("img");
      img.addEventListener("load", refresh);
      img.addEventListener("error", function () { setTimeout(refresh, 0); });
    });

    toggle.addEventListener("click", function () { paused = !paused; labelToggle(); });
    buttons.forEach(function (b) { b.addEventListener("click", labelToggle); });

    setInterval(function () {
      if (!paused && !document.hidden) next();
    }, INTERVAL);

    labelToggle();
    refresh();
  }
})();
