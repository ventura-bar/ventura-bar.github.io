/* Bar Ventura — portfolio · renders sections from js/content.js
   You should not need to touch this file to change content. */
(function () {
  "use strict";

  const P = window.PORTFOLIO;
  if (!P) return;

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  /* minimal markdown: **text** → bold */
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const line = (cls, html) =>
    '<div class="line' + (cls ? " " + cls : "") + '">' + (html || "") + "</div>";

  const mailLink =
    '<a class="md-link" href="mailto:' + esc(P.email) + '">' + esc(P.email) + "</a>";
  const gmailUrl =
    "https://mail.google.com/mail/?view=cm&fm=1&to=" + encodeURIComponent(P.email);

  /* ── README.md ────────────────────────────── */
  const r = [];
  r.push(
    line(
      "md-h1",
      '<span class="md-mark"># </span><span id="heroName" data-text="' +
        esc(P.name) + '">' + esc(P.name) +
        '</span><span class="caret" id="heroCaret" aria-hidden="true"></span>'
    )
  );
  r.push(line("md-h2", '<span class="md-mark">## </span>' + esc(P.title)));
  r.push(line());
  P.summary.forEach((s) =>
    r.push(line("md-quote", '<span class="md-mark">&gt; </span>' + md(s)))
  );
  r.push(line());
  r.push(line("md-h2", '<span class="md-mark">## </span>Highlights'));
  P.highlights.forEach((h) =>
    r.push(line("md-li", '<span class="md-mark">- </span>' + md(h)))
  );
  r.push(line());
  r.push(line("md-h2", '<span class="md-mark">## </span>Quick links'));
  [
    ["experience", "experience.yaml", "where I've worked & what I shipped"],
    ["skills", "Extensions: Skills", "the stack I work with"],
    ["education", "education.md", "how I got here"],
    ["contact", "contact.sh", "say hi 👋"],
  ].forEach(([id, label, desc]) =>
    r.push(
      line(
        "md-li",
        '<span class="md-mark">- </span><a class="md-link" href="#' + id +
          '" data-open="' + id + '">' + esc(label) +
          '</a><span class="md-dim"> — ' + esc(desc) + "</span>"
      )
    )
  );
  r.push(
    line(
      "md-li",
      '<span class="md-mark">- </span><a class="md-link" href="' + esc(P.resumePdf) +
        '" download>resume.pdf</a><span class="md-dim"> — download my resume ⤓</span>'
    )
  );
  r.push(line());
  r.push(line("md-dim", "📍 " + esc(P.location) + "&nbsp;&nbsp;·&nbsp;&nbsp;✉️ " + mailLink));
  document.getElementById("readme").innerHTML = '<div class="code">' + r.join("") + "</div>";

  /* ── experience.yaml ──────────────────────── */
  const kv = (key, valHtml) =>
    '<span class="tok-key">' + key + '</span><span class="tok-punct">:</span> ' + valHtml;
  const e = [];
  e.push(line("", '<span class="tok-comment"># my career, declaratively</span>'));
  e.push(line("", kv("apiVersion", '<span class="tok-str">career/v1</span>')));
  e.push(line("", kv("kind", '<span class="tok-type">Experience</span>')));
  e.push(line());
  e.push(line("", '<span class="tok-key">roles</span><span class="tok-punct">:</span>'));
  P.experience.forEach((role, i) => {
    e.push(
      line(
        "yml-role",
        '<span class="tok-punct">- </span>' +
          kv("title", '<span class="tok-str role-title">' + esc(role.title) + "</span>") +
          (role.note ? ' <span class="tok-comment"># ' + esc(role.note) + "</span>" : "")
      )
    );
    if (role.company) e.push(line("yml-ind", kv("company", '<span class="tok-str">' + esc(role.company) + "</span>")));
    e.push(line("yml-ind", kv("period", '<span class="tok-str">' + esc(role.period) + "</span>")));
    e.push(line("yml-ind", '<span class="tok-key">highlights</span><span class="tok-punct">:</span>'));
    role.highlights.forEach((h) =>
      e.push(line("yml-li", '<span class="tok-punct">- </span>' + md(h)))
    );
    if (i < P.experience.length - 1) e.push(line());
  });
  document.getElementById("experience").innerHTML = '<div class="code">' + e.join("") + "</div>";

  /* ── Extensions: Skills ───────────────────── */
  const cards = P.skills
    .map(
      (p) =>
        '<article class="ext-card">' +
        '<div class="ext-icon">' + p.icon + "</div>" +
        '<div class="ext-main">' +
        '<div class="ext-title">' + esc(p.pack) + ' <span class="ext-stars">⭐ 5.0</span></div>' +
        '<div class="ext-pub">' + esc(P.name.toLowerCase().replace(/\s+/g, ".")) + ' · ' + esc(p.pub) + "</div>" +
        '<div class="ext-pills">' +
        p.items.map((i) => '<span class="pill">' + esc(i) + "</span>").join("") +
        "</div></div>" +
        '<span class="ext-installed">✓ Installed</span>' +
        "</article>"
    )
    .join("");
  document.getElementById("skills").innerHTML =
    '<div class="ext-view">' +
    '<div class="ext-header">Extensions: Installed <span class="ext-count">— ' +
    P.skills.length + " packs · all up to date ✓</span></div>" +
    cards +
    "</div>";

  /* ── education.md ─────────────────────────── */
  const ed = [];
  ed.push(line("md-h1", '<span class="md-mark"># </span>Education'));
  ed.push(line());
  ed.push(line("md-h2", '<span class="md-mark">## </span>🎓 Degrees &amp; certifications'));
  ed.push(line());
  P.education.forEach((d) => {
    ed.push(
      line("md-li", '<span class="md-mark">- </span><b>' + esc(d.degree) + "</b>" + (d.org ? " — " + esc(d.org) : ""))
    );
    ed.push(line("md-sub", '<span class="md-dim">' + esc(d.period) + "</span>"));
  });
  if (P.highschool) {
    ed.push(line());
    ed.push(line("md-h2", '<span class="md-mark">## </span>' + esc(P.highschool.title)));
    ed.push(line());
    (Array.isArray(P.highschool.note) ? P.highschool.note : [P.highschool.note]).forEach((n, i) =>
      ed.push(i === 0
        ? line("md-quote", '<span class="md-mark">&gt; </span>' + md(n))
        : line("md-li",    '<span class="md-mark">- </span>'    + md(n))
      )
    );
  }
  document.getElementById("education").innerHTML = '<div class="code">' + ed.join("") + "</div>";

  /* ── contact.sh ───────────────────────────── */
  const sh = (key, valHtml) =>
    '<span class="tok-key">' + key + '</span><span class="tok-punct">=</span>' +
    '<span class="tok-str">"' + valHtml + '"</span>';
  const c = [];
  c.push(line("", '<span class="tok-comment">#!/usr/bin/env bash</span>'));
  c.push(line("", '<span class="tok-comment"># Let\'s build something together.</span>'));
  c.push(line());
  c.push(line("", sh("NAME", esc(P.name))));
  c.push(line("", sh("EMAIL", mailLink)));
  c.push(line("", sh("LOCATION", esc(P.location))));
  c.push(line("", sh("STATUS", esc(P.status))));
  const socials = P.socials || {};
  const links = Object.entries(socials).filter(([, url]) => url);
  const missing = Object.entries(socials).filter(([, url]) => !url);
  if (links.length || missing.length) c.push(line());
  links.forEach(([name, url]) =>
    c.push(
      line(
        "",
        sh(
          name.toUpperCase(),
          '<a class="md-link" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(url) + "</a>"
        )
      )
    )
  );
  if (missing.length) {
    c.push(
      line(
        "",
        '<span class="tok-comment"># TODO: add ' +
          missing.map(([n]) => n).join(" & ") + " in js/content.js</span>"
      )
    );
  }
  c.push(line());
  c.push(line("", '<span class="tok-fn">echo</span> <span class="tok-str">"The fastest way to reach me:"</span>'));
  c.push(
    line(
      "",
      '<span class="tok-fn">open</span> <span class="tok-str">"mailto:</span><span class="tok-key">$EMAIL</span><span class="tok-str">"</span>&nbsp;&nbsp;<span class="tok-comment"># or just click it ↑</span>'
    )
  );
  c.push(line());
  c.push(
    line(
      "",
      '<a class="cta-btn" href="mailto:' + esc(P.email) + '">▶ Run contact.sh — copy my email</a>'
    )
  );
  document.getElementById("contact").innerHTML = '<div class="code">' + c.join("") + "</div>";

  /* ── chrome bits that depend on content ───── */
  const printHeader = document.getElementById("printHeader");
  if (printHeader) {
    printHeader.innerHTML =
      "<strong>" + esc(P.name) + "</strong> — " + esc(P.title) + " · " +
      esc(P.email) + " · " + esc(P.location);
  }
  const toastLink = document.querySelector(".toast-link");
  if (toastLink) toastLink.href = gmailUrl;
  const abMail = document.getElementById("abMailBtn");
  if (abMail) {
    abMail.href = "mailto:" + P.email;
    abMail.title = "Contact me — copies " + P.email;
  }
  const sbStatus = document.querySelector(".sb-status");
  if (sbStatus) {
    sbStatus.href = "mailto:" + P.email;
    sbStatus.textContent = P.status;
  }
  const palEmailHint = document.querySelector('#paletteList li[data-cmd="email"] .pal-hint');
  if (palEmailHint) palEmailHint.textContent = P.email;

  const resumeLink = document.getElementById("resumeLink");
  if (resumeLink && P.resumePdf) resumeLink.href = P.resumePdf;

  const titlebarTitle = document.querySelector(".titlebar-title");
  if (titlebarTitle && P.name) {
    const slug = P.name.toLowerCase().replace(/\s+/g, "-");
    titlebarTitle.textContent = "README.md — " + slug + " — portfolio";
  }

  /* ── meta tags (for browsers; crawlers need the static <head> values) ── */
  document.title = P.name + " — " + P.title;

  const setMeta = (sel, attr, val) => {
    const el = document.querySelector(sel);
    if (el && val) el.setAttribute(attr, val);
  };
  const desc = [P.name + " — " + P.title, P.summary?.[0]].filter(Boolean).join(". ");
  setMeta('meta[name="description"]',        "content", desc);
  setMeta('meta[property="og:title"]',       "content", P.name + " — " + P.title);
  setMeta('meta[property="og:description"]', "content", desc);
  setMeta('meta[name="twitter:title"]',      "content", P.name + " — " + P.title);
  if (P.siteUrl) {
    setMeta('link[rel="canonical"]',       "href",    P.siteUrl);
    setMeta('meta[property="og:url"]',     "content", P.siteUrl);
  }
  if (P.ogImage) {
    const img = (P.siteUrl && !P.ogImage.startsWith("http"))
      ? P.siteUrl + P.ogImage
      : P.ogImage;
    setMeta('meta[property="og:image"]',   "content", img);
    setMeta('meta[name="twitter:image"]',  "content", img);
  }

  /* ── JSON-LD structured data ─────────────────────────────── */
  const ld = {
    "@context": "https://schema.org",
    "@type":    "Person",
    name:       P.name,
    jobTitle:   P.title,
  };
  if (P.email)        ld.email    = "mailto:" + P.email;
  if (P.location)     ld.address  = { "@type": "PostalAddress", addressLocality: P.location };
  if (P.education?.[0]) ld.alumniOf = P.education[0].org;
  if (P.skills)       ld.knowsAbout = P.skills.flatMap((s) => s.items);
  const ldScript = document.createElement("script");
  ldScript.type = "application/ld+json";
  ldScript.textContent = JSON.stringify(ld);
  document.head.appendChild(ldScript);
})();
