(function () {
  var C = window.CONTENT, $ = function (s) { return document.querySelector(s); };
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); };
  var set = function (s, h) { $(s).innerHTML = h; };
  var chips = function (a) { return '<ul class="chips">' + a.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>"; };
  var meta = function (e) { return '<p class="meta">' + esc(e.company) + " &middot; " + esc(e.dates) + "</p>"; };
  var link = function (u, l) { return '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(l) + "</a>"; };

  set("#top", '<div><h1>' + esc(C.greeting) + '</h1><p class="phrase" id="phrase" aria-live="off">' + esc(C.phrases[0]) + '</p><p class="pitch">' + esc(C.pitch) +
    '</p><div class="btns"><a class="btn primary" href="' + esc(C.cv) + '" download>Download my CV</a><a class="btn ghost" href="#contact">Say hello</a></div><p class="role">' + esc(C.title) + '</p></div>' +
    '<div class="gemwrap"><canvas id="gem" role="img" aria-label="Animated faceted gem that shifts with your cursor"></canvas>' + (C.photo ? '<img src="' + esc(C.photo) + '" alt="' + esc(C.photoAlt) + '">' : "") + "</div>");
  var tools = C.tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
  set("#marquee", tools + tools);
  $("#t-about").textContent = C.aboutTitle; $("#t-exp").textContent = C.experienceTitle; $("#t-edu").textContent = C.educationTitle;
  $("#t-skills").textContent = C.skillsTitle; $("#t-proj").textContent = C.projectsTitle; $("#t-contact").textContent = C.contactTitle;

  set("#about-body", C.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
    '<div class="facts">' + C.facts.map(function (f) { return '<span class="fact"><b>' + esc(f.label) + ":</b> " + esc(f.value) + "</span>"; }).join("") + "</div>" +
    '<ul class="stats">' + C.stats.map(function (s) { return '<li class="stat reveal"><b data-n="' + s.n + '" data-s="' + esc(s.suffix) + '">' + s.n + esc(s.suffix) + "</b><span>" + esc(s.label) + "</span></li>"; }).join("") + "</ul>");

  set("#exp-body", '<ol class="tl">' + C.experience.map(function (e) {
    return '<li class="reveal"><h3>' + esc(e.role) + "</h3>" + meta(e) + "<ul>" + e.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></li>";
  }).join("") + '</ol><h3 class="sub">Earlier on</h3><ol class="tl">' + C.earlier.map(function (e) {
    return '<li class="reveal"><h3>' + esc(e.role) + "</h3>" + meta(e) + "<p>" + esc(e.text) + "</p></li>";
  }).join("") + "</ol>");

  var certs = (C.certifications || []).map(function (c) { return '<div class="edu"><h3>' + esc(c.name) + '</h3><p class="meta">' + esc([c.issuer, c.year].filter(Boolean).join(" · ")) + "</p></div>"; }).join("");
  set("#edu-body", C.education.map(function (e) { return '<div class="edu reveal"><h3>' + esc(e.degree) + '</h3><p class="meta">' + esc(e.school) + " &middot; " + esc(e.dates) + "</p></div>"; }).join("") + (certs ? '<h3 class="sub">Certifications</h3>' + certs : ""));

  set("#skills-body", C.skills.map(function (g) { return '<h3 class="group">' + esc(g.group) + "</h3>" + chips(g.items); }).join("") +
    '<h3 class="group">Languages</h3>' + chips(C.languages.map(function (l) { return l.name + " (" + l.level + ")"; })));

  set("#proj-body", C.projects.map(function (p) {
    return '<article class="card reveal"><h3>' + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>" + chips(p.tags) + (p.url ? link(p.url, p.urlLabel || "View project") : '<small class="meta">' + esc(p.urlLabel || "") + "</small>") + "</article>";
  }).join(""));

  set("#contact-body", '<div class="contact"><p>' + esc(C.contactText) + '</p><a class="big" href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a><ul>" +
    C.links.filter(function (l) { return l.url; }).map(function (l) { return "<li>" + link(l.url, l.label) + "</li>"; }).join("") + "<li>" + esc(C.location) + "</li></ul></div>");
  set("#foot", "&copy; " + new Date().getFullYear() + " " + esc(C.name) + ". Thanks for stopping by.");

  // Rotating phrases
  var ph = $("#phrase"), pi = 0;
  if (!still) setInterval(function () { ph.classList.add("out"); setTimeout(function () { pi = (pi + 1) % C.phrases.length; ph.textContent = C.phrases[pi]; ph.classList.remove("out"); }, 350); }, 2800);

  // Live gem: a brilliant-cut gem whose facets catch light from your cursor
  var cv = $("#gem"), x = cv.getContext("2d"), W, dpr, t = 0, m = { x: .3, y: -.4 };
  function size() { dpr = devicePixelRatio || 1; W = cv.clientWidth; cv.width = cv.height = W * dpr; }
  size(); addEventListener("resize", size);
  addEventListener("pointermove", function (e) { var r = cv.getBoundingClientRect(); m.x = Math.max(-1.5, Math.min(1.5, ((e.clientX - r.left) / r.width - .5) * 2)); m.y = Math.max(-1.5, Math.min(1.5, ((e.clientY - r.top) / r.height - .5) * 2)); });
  function ring(n, r, off, ox, oy) { var a = []; for (var i = 0; i < n; i++) { var g = (i + off) / n * Math.PI * 2 + t * .15; a.push([W / 2 + Math.cos(g) * r + ox, W / 2 + Math.sin(g) * r + oy]); } return a; }
  function face(p, k) {
    var cx = (p[0][0] + p[1][0] + p[2][0]) / 3, cy = (p[0][1] + p[1][1] + p[2][1]) / 3, a = Math.atan2(cy - W / 2, cx - W / 2), la = Math.atan2(m.y, m.x);
    var l = 52 + 30 * Math.cos(a - la) * Math.min(1, .5 + Math.hypot(m.x, m.y)) + 6 * Math.sin(t * 2 + k);
    var h = 235 + (a / Math.PI) * 55 + m.x * 25 + 12 * Math.sin(t + k);
    x.beginPath(); x.moveTo(p[0][0], p[0][1]); x.lineTo(p[1][0], p[1][1]); x.lineTo(p[2][0], p[2][1]); x.closePath();
    x.fillStyle = "hsl(" + h + " 85% " + l + "%)"; x.fill(); x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 1; x.stroke();
  }
  function draw() {
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, W);
    var N = 12, R = W * .46, O = ring(N, R, 0, 0, 0), M = ring(N, R * .7, .5, m.x * W * .02, m.y * W * .02), T = ring(N, R * .4, 0, m.x * W * .05, m.y * W * .05), k = 0;
    for (var i = 0; i < N; i++) {
      var j = (i + 1) % N, p = (i + N - 1) % N;
      face([O[i], O[j], M[i]], k++); face([O[i], M[p], M[i]], k++); face([M[p], M[i], T[i]], k++); face([M[i], T[i], T[j]], k++);
    }
    x.beginPath(); T.forEach(function (q, i) { i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); }); x.closePath();
    x.fillStyle = "hsl(" + (260 + m.x * 30) + " 90% " + (78 + m.y * -8) + "%)"; x.fill(); x.stroke();
    t += .008; if (!still) requestAnimationFrame(draw);
  }
  draw();

  // Reveal, count-up and active nav
  var els = document.querySelectorAll(".reveal"), links = document.querySelectorAll("#navlinks a");
  function count(b) { var n = +b.dataset.n, s = b.dataset.s, st = performance.now(); (function f(now) { var p = Math.min(1, (now - st) / 1200); b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s; if (p < 1) requestAnimationFrame(f); })(st); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); var b = e.target.querySelector("b[data-n]"); if (b && !still) count(b); io.unobserve(e.target); } }); }, { threshold: .2 });
    els.forEach(function (r) { io.observe(r); });
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); }); }); }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { so.observe(s); });
  } else els.forEach(function (r) { r.classList.add("in"); });
})();
