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
      slides.forEach(function (sl, k) {
        if (sl.classList.contains("is-zoomable")) sl.tabIndex = k === current ? 0 : -1;
      });
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

  /* ---------- 5. Photo viewer ----------
     Tap (or Enter/Space on) a photo to see it large in a card, with its
     caption. Close with the X, a tap outside, or Esc. Only real photos
     (not "missing" placeholders) can be opened. Without JS nothing changes. */
  var viewer = document.getElementById("viewer");
  if (viewer && typeof viewer.showModal === "function") {
    var vImg = viewer.querySelector(".viewer__img");
    var vCap = viewer.querySelector(".viewer__cap");
    var lang = function () { return document.documentElement.lang || "en"; };

    var captionOf = function (fig) {
      var box = fig.closest(".slide, .card, .culture__item");
      var c = box && box.querySelector("figcaption, p");
      return c ? c.textContent.trim() : "";
    };

    var label = function (fig) {
      var img = fig.querySelector("img");
      fig.setAttribute("aria-label", t(lang(), "viewer.open") + ": " + (img.alt || captionOf(fig)));
    };

    var open = function (fig) {
      if (fig.classList.contains("is-missing")) return;
      var img = fig.querySelector("img");
      vImg.src = img.currentSrc || img.src;
      vImg.alt = img.alt;
      vCap.textContent = captionOf(fig);
      document.body.classList.add("has-viewer");
      viewer.showModal();
    };

    var enable = function (fig) {
      if (fig.classList.contains("is-zoomable") || fig.classList.contains("is-missing")) return;
      fig.classList.add("is-zoomable");
      fig.setAttribute("role", "button");
      fig.tabIndex = fig.classList.contains("slide") && !fig.classList.contains("is-active") ? -1 : 0;
      label(fig);
      fig.addEventListener("click", function () { open(fig); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(fig); }
      });
    };

    document.querySelectorAll(".photo:not(.photo--avatar)").forEach(function (fig) {
      var img = fig.querySelector("img");
      if (!img) return;
      if (img.complete && img.naturalWidth > 0) enable(fig);
      else img.addEventListener("load", function () { enable(fig); });
    });

    viewer.querySelector(".viewer__close").addEventListener("click", function () { viewer.close(); });
    viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener("close", function () {
      document.body.classList.remove("has-viewer");
      vImg.removeAttribute("src");
    });
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".is-zoomable").forEach(label);
      });
    });
  }
})();
