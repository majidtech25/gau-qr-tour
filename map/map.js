/* =========================================================
   Campus route-finder
   - Pick "You are at" + "Going to" → shortest walking route
     (Dijkstra over map/data.js), drawn on the SVG map, with
     step-by-step directions.
   - Presets via URL: map/?from=gate-a&to=admissions
     (a QR at each gate can open the map with "from" filled in).
   - Text comes from js/i18n.js (map.* keys), English fallback.
   ========================================================= */

(function () {
  "use strict";

  var C = window.CAMPUS;
  var dict = window.I18N || {};
  var SVGNS = "http://www.w3.org/2000/svg";
  var WALK_M_PER_MIN = 80; // typical walking pace, used for "about N min"

  /* ---------- i18n ---------- */
  var lang = "en";
  try { lang = localStorage.getItem("gau-lang") || "en"; } catch (e) {}
  if (!dict[lang]) lang = "en";
  document.documentElement.lang = lang;

  function t(key, vars) {
    var s = (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || key;
    Object.keys(vars || {}).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if ((dict[lang] && dict[lang][k]) || (dict.en && dict.en[k])) el.textContent = t(k);
  });
  document.getElementById("demo-note").hidden = !C.demo;

  /* ---------- graph ---------- */
  var nodes = {};
  C.nodes.forEach(function (n) { nodes[n.id] = n; });
  var adj = {};
  C.nodes.forEach(function (n) { adj[n.id] = []; });
  function dist(a, b) { return Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y); }
  C.edges.forEach(function (e) {
    var d = dist(e[0], e[1]);
    adj[e[0]].push({ to: e[1], d: d });
    adj[e[1]].push({ to: e[0], d: d });
  });
  var places = C.nodes.filter(function (n) { return n.kind === "place"; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });

  // Dijkstra: small graph, a simple O(n²) scan is plenty.
  function shortestPath(from, to) {
    var best = {}, prev = {}, done = {};
    Object.keys(nodes).forEach(function (id) { best[id] = Infinity; });
    best[from] = 0;
    for (;;) {
      var u = null;
      Object.keys(best).forEach(function (id) {
        if (!done[id] && best[id] < Infinity && (u === null || best[id] < best[u])) u = id;
      });
      if (u === null || u === to) break;
      done[u] = true;
      adj[u].forEach(function (e) {
        if (best[u] + e.d < best[e.to]) { best[e.to] = best[u] + e.d; prev[e.to] = u; }
      });
    }
    if (best[to] === Infinity) return null;
    var path = [to];
    while (path[0] !== from) path.unshift(prev[path[0]]);
    return { path: path, length: best[to] };
  }

  // Turn at b when walking a → b → c. Screen coords (y down): cross > 0 = right.
  function turnAt(a, b, c) {
    var v1x = nodes[b].x - nodes[a].x, v1y = nodes[b].y - nodes[a].y;
    var v2x = nodes[c].x - nodes[b].x, v2y = nodes[c].y - nodes[b].y;
    var angle = Math.atan2(v1x * v2y - v1y * v2x, v1x * v2x + v1y * v2y) * 180 / Math.PI;
    if (Math.abs(angle) < 30) return "straight";
    return angle > 0 ? "right" : "left";
  }

  function round10(m) { return Math.max(10, Math.round(m / 10) * 10); }

  function directions(path) {
    var steps = [{ text: t("map.start", { name: nodes[path[0]].name }) }];
    var acc = 0;
    for (var i = 0; i < path.length - 1; i++) {
      acc += dist(path[i], path[i + 1]);
      if (i + 2 < path.length) {
        var turn = turnAt(path[i], path[i + 1], path[i + 2]);
        if (turn === "straight") continue;
        steps.push({ text: t(turn === "left" ? "map.stepLeft" : "map.stepRight", { m: round10(acc) }) });
        acc = 0;
      }
    }
    steps.push({ text: t("map.arrive", { m: round10(acc), name: nodes[path[path.length - 1]].name }), end: true });
    return steps;
  }

  /* ---------- drawing ---------- */
  var svg = document.getElementById("map");
  svg.setAttribute("viewBox", "0 0 " + C.size.w + " " + C.size.h);
  function el(name, attrs, parent, text) {
    var e = document.createElementNS(SVGNS, name);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text) e.textContent = text;
    parent.appendChild(e);
    return e;
  }
  var L = {
    blocks: document.getElementById("layer-blocks"),
    paths: document.getElementById("layer-paths"),
    route: document.getElementById("layer-route"),
    places: document.getElementById("layer-places")
  };

  (C.blocks || []).forEach(function (b) {
    el("rect", { class: "block", x: b.x, y: b.y, width: b.w, height: b.h, rx: 4 }, L.blocks);
    if (b.label) el("text", { class: "block-label", x: b.x + b.w / 2, y: b.y + b.h / 2 + 3.5 }, L.blocks, b.label);
  });
  C.edges.forEach(function (e) {
    el("line", { class: "path", x1: nodes[e[0]].x, y1: nodes[e[0]].y, x2: nodes[e[1]].x, y2: nodes[e[1]].y }, L.paths);
  });
  places.forEach(function (p) {
    el("circle", { class: "place", cx: p.x, cy: p.y, r: 3.5 }, L.places);
    var right = p.x < C.size.w * 0.7;
    el("text", { class: "place-label", x: p.x + (right ? 6 : -6), y: p.y - 6, "text-anchor": right ? "start" : "end" }, L.places, p.name);
  });

  function drawRoute(path) {
    L.route.textContent = "";
    if (!path) return;
    var pts = path.map(function (id) { return nodes[id].x + "," + nodes[id].y; }).join(" ");
    el("polyline", { class: "route", points: pts }, L.route);
    var a = nodes[path[0]], b = nodes[path[path.length - 1]];
    el("circle", { class: "marker-start", cx: a.x, cy: a.y, r: 7 }, L.route);
    el("circle", { class: "marker-end", cx: b.x, cy: b.y, r: 7 }, L.route);
  }

  /* ---------- UI ---------- */
  var fromSel = document.getElementById("from");
  var toSel = document.getElementById("to");
  var summary = document.getElementById("summary");
  var stepsList = document.getElementById("steps");

  [fromSel, toSel].forEach(function (sel) {
    var ph = document.createElement("option");
    ph.value = ""; ph.textContent = t("map.choose");
    sel.appendChild(ph);
    places.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p.id; o.textContent = p.name;
      sel.appendChild(o);
    });
  });

  var params = new URLSearchParams(location.search);
  if (nodes[params.get("from")]) fromSel.value = params.get("from");
  if (nodes[params.get("to")]) toSel.value = params.get("to");

  function update() {
    var from = fromSel.value, to = toSel.value;
    stepsList.textContent = "";
    summary.textContent = "";
    drawRoute(null);

    var q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    try { history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "")); } catch (e) {}

    if (!from || !to) { summary.textContent = t("map.pick"); return; }
    if (from === to) { summary.textContent = t("map.same"); return; }

    var r = shortestPath(from, to);
    if (!r) { summary.textContent = t("map.noroute"); return; }

    var metres = round10(r.length);
    summary.textContent = t("map.summary", { min: Math.max(1, Math.ceil(r.length / WALK_M_PER_MIN)), m: metres });
    drawRoute(r.path);
    directions(r.path).forEach(function (s) {
      var li = document.createElement("li");
      li.textContent = s.text;
      if (s.end) li.className = "is-end";
      stepsList.appendChild(li);
    });
  }

  fromSel.addEventListener("change", update);
  toSel.addEventListener("change", update);
  document.getElementById("swap").addEventListener("click", function () {
    var f = fromSel.value; fromSel.value = toSel.value; toSel.value = f; update();
  });

  update();
})();
