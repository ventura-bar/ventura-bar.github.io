/* portfolio · the clean (non-developer) view
   Rendered from js/content.js — you should not need to touch this file. */
(function () {
  "use strict";

  const P = window.PORTFOLIO;
  const root = document.getElementById("cleanApp");
  if (!P || !root || !window.PortfolioUtil) return;

  const { esc, md } = window.PortfolioUtil;

  const ICONS = {
    download:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4 7.5l8 6 8-6"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.97 1.97 0 100 3.94 1.97 1.97 0 000-3.94zM20.44 13.4c0-3.3-1.76-5.17-4.36-5.17-1.6 0-2.6.82-3.06 1.6V8.5H9.66V20h3.38v-6.1c0-1.5.72-2.6 2.1-2.6 1.3 0 1.92.94 1.92 2.6V20h3.38v-6.6z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M12 2.5a9.5 9.5 0 00-3 18.51c.48.09.65-.2.65-.46v-1.7c-2.64.57-3.2-1.13-3.2-1.13-.43-1.1-1.06-1.4-1.06-1.4-.86-.59.07-.58.07-.58.96.07 1.46.98 1.46.98.85 1.46 2.23 1.04 2.78.8.08-.62.33-1.04.6-1.28-2.1-.24-4.32-1.05-4.32-4.69 0-1.03.37-1.88.98-2.54-.1-.24-.43-1.2.09-2.5 0 0 .8-.26 2.61.97a9.07 9.07 0 014.76 0c1.81-1.23 2.6-.97 2.6-.97.53 1.3.2 2.26.1 2.5.61.66.98 1.5.98 2.54 0 3.65-2.22 4.45-4.34 4.68.34.3.65.87.65 1.76v2.6c0 .26.17.56.66.46A9.5 9.5 0 0012 2.5z"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m0 0l-5.5-5.5M19 12l-5.5 5.5"/></svg>',
  };

  const socials = Object.entries(P.socials || {}).filter(([, url]) => url);
  const socialLabel = (n) => (n === "linkedin" ? "LinkedIn" : n === "github" ? "GitHub" : n);
  const mailto = "mailto:" + esc(P.email);
  const status = String(P.status || "").replace(/^[^\p{L}\p{N}]+/u, "");
  const current = (P.experience || [])[0];

  /* split a leading emoji off a string: "🏫 High school" → ["🏫", "High school"] */
  const splitIcon = (s) => {
    const m = String(s).match(/^([^\p{L}\p{N}*]+)\s*(.*)$/u);
    return m ? [m[1].trim(), m[2]] : ["", String(s)];
  };

  const sectionHead = (num, title, sub) =>
    '<header class="c-head"><span class="c-num">' + num + "</span><h2>" + esc(title) +
    "</h2>" + (sub ? '<p class="c-sub">' + esc(sub) + "</p>" : "") + "</header>";

  /* ── nav ──────────────────────────────────── */
  const NAV = [
    ["experience", "Experience"],
    ["skills", "Skills"],
    ["education", "Education"],
    ["contact", "Contact"],
  ];
  const nav =
    '<nav class="c-nav" aria-label="Sections"><div class="c-nav-inner">' +
    '<a class="c-brand" href="#top" data-scroll="top">' + esc(P.name) + "</a>" +
    '<div class="c-nav-links">' +
    NAV.map(([id, label]) => '<a href="#' + id + '" data-scroll="' + id + '">' + label + "</a>").join("") +
    '<a class="c-btn c-btn-sm" href="' + esc(P.resumePdf) + '" download title="Download my resume (PDF)">' +
    ICONS.download + "<span>Resume</span></a>" +
    "</div></div></nav>";

  /* ── hero ─────────────────────────────────── */
  const hero =
    '<section class="c-hero" id="c-top">' +
    '<div class="c-hero-text">' +
    (status ? '<a class="c-status" href="' + mailto + '"><span class="c-pulse"></span>' + esc(status) + "</a>" : "") +
    '<h1 class="c-name">' + esc(P.name) + "</h1>" +
    '<p class="c-title">' + esc(P.title) + "</p>" +
    (current
      ? '<p class="c-now"><span>Now</span>' + esc(current.title) +
        (current.company ? " · " + esc(current.company) : "") + "</p>"
      : "") +
    '<p class="c-summary">' + md((P.summary || []).join(" ")) + "</p>" +
    '<div class="c-cta">' +
    '<a class="c-btn c-btn-primary" href="' + esc(P.resumePdf) + '" download>' + ICONS.download + "<span>Download resume</span></a>" +
    '<a class="c-btn" href="' + mailto + '" title="Copies ' + esc(P.email) + '">' + ICONS.mail + "<span>Copy email</span></a>" +
    socials
      .map(([n, url]) =>
        '<a class="c-btn c-btn-icon" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="' +
        esc(socialLabel(n)) + '" title="' + esc(socialLabel(n)) + '">' + (ICONS[n] || ICONS.arrow) + "</a>")
      .join("") +
    "</div>" +
    '<p class="c-loc">' + esc(P.location) + "</p>" +
    "</div>" +
    (P.photo
      ? '<div class="c-photo"><img src="' + esc(P.photo) + '" alt="Portrait of ' + esc(P.name) +
        '" width="320" height="320"></div>'
      : "") +
    "</section>";

  /* ── experience ───────────────────────────── */
  const experience =
    '<section class="c-section" id="c-experience">' +
    sectionHead("01", "Experience", "Where I've worked and what I shipped") +
    '<ol class="c-timeline">' +
    (P.experience || [])
      .map((role, i) =>
        '<li class="c-role' + (i === 0 ? " is-current" : "") + '">' +
        '<div class="c-role-when">' + esc(role.period) + "</div>" +
        '<article class="c-card c-role-card">' +
        '<h3>' + esc(role.title) +
        (i === 0 ? '<span class="c-tag c-tag-now">Now</span>' : "") +
        (role.note ? '<span class="c-tag">' + esc(role.note) + "</span>" : "") + "</h3>" +
        (role.company ? '<p class="c-role-co">' + esc(role.company) + "</p>" : "") +
        "<ul>" + role.highlights.map((h) => "<li>" + md(h) + "</li>").join("") + "</ul>" +
        "</article></li>")
      .join("") +
    "</ol></section>";

  /* ── skills ───────────────────────────────── */
  const skills =
    '<section class="c-section" id="c-skills">' +
    sectionHead("02", "Skills", "The stack I work with") +
    '<div class="c-skills">' +
    (P.skills || [])
      .map((s) =>
        '<article class="c-card c-skill">' +
        '<div class="c-skill-top"><span class="c-skill-icon" aria-hidden="true">' + s.icon + "</span>" +
        "<div><h3>" + esc(s.pack) + '</h3><p>' + esc(s.pub) + "</p></div></div>" +
        '<ul class="c-chips">' + s.items.map((it) => "<li>" + esc(it) + "</li>").join("") + "</ul>" +
        "</article>")
      .join("") +
    "</div></section>";

  /* ── education ────────────────────────────── */
  let hs = "";
  if (P.highschool) {
    const hsTitle = splitIcon(P.highschool.title)[1];
    const notes = Array.isArray(P.highschool.note) ? P.highschool.note : [P.highschool.note];
    hs =
      '<article class="c-card c-edu c-edu-wide">' +
      "<h3>" + esc(hsTitle) + "</h3>" +
      '<p class="c-edu-org">' + md(notes[0] || "") + "</p>" +
      '<ul class="c-chips">' +
      notes.slice(1).map((n) => "<li>" + esc(splitIcon(n)[1]) + "</li>").join("") +
      "</ul></article>";
  }
  const education =
    '<section class="c-section" id="c-education">' +
    sectionHead("03", "Education", "Degrees and certifications") +
    '<div class="c-edu-grid">' +
    (P.education || [])
      .map((d) =>
        '<article class="c-card c-edu"><h3>' + esc(d.degree) + "</h3>" +
        (d.org ? '<p class="c-edu-org">' + esc(d.org) + "</p>" : "") +
        '<p class="c-edu-when">' + esc(d.period) + "</p></article>")
      .join("") +
    hs +
    "</div></section>";

  /* ── contact ──────────────────────────────── */
  const contact =
    '<section class="c-section" id="c-contact">' +
    '<div class="c-card c-contact">' +
    '<span class="c-num">04</span>' +
    "<h2>Let's build something together.</h2>" +
    '<a class="c-email" href="' + mailto + '" title="Click to copy">' + esc(P.email) + "</a>" +
    '<div class="c-cta">' +
    '<a class="c-btn c-btn-primary" href="' + mailto + '">' + ICONS.mail + "<span>Copy email</span></a>" +
    '<a class="c-btn" href="' + esc(P.resumePdf) + '" download>' + ICONS.download + "<span>Download resume</span></a>" +
    socials
      .map(([n, url]) =>
        '<a class="c-btn" href="' + esc(url) + '" target="_blank" rel="noopener">' +
        (ICONS[n] || ICONS.arrow) + "<span>" + esc(socialLabel(n)) + "</span></a>")
      .join("") +
    "</div></div></section>";

  /* ── footer ───────────────────────────────── */
  const footer =
    '<footer class="c-footer"><span>© ' + new Date().getFullYear() + " " + esc(P.name) + "</span>" +
    '<button type="button" class="c-footer-dev" data-set-mode="dev">Prefer an IDE? ' +
    "<code>&lt; Developer Mode /&gt;</code></button></footer>";

  root.innerHTML =
    '<div class="c-aurora" aria-hidden="true"><i></i><i></i><i></i></div>' +
    nav +
    '<main class="c-main">' + hero + experience + skills + education + contact + "</main>" +
    footer;

  /* ── in-page navigation ───────────────────── */
  function scrollToSection(id, smooth) {
    const el = document.getElementById("c-" + id);
    if (!el) return false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" });
    return true;
  }

  root.addEventListener("click", (e) => {
    const link = e.target.closest("[data-scroll]");
    if (!link) return;
    e.preventDefault();
    const id = link.dataset.scroll;
    if (scrollToSection(id, true)) {
      history.replaceState(null, "", id === "top" ? location.pathname + location.search : "#" + id);
    }
  });

  /* nav gets a solid backdrop once the page is scrolled */
  const navEl = root.querySelector(".c-nav");
  const onScroll = () => navEl.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  window.Clean = { scrollToSection };
})();
