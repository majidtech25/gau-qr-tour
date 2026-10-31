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
})();
