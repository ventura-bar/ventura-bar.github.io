/* portfolio · clean site ⇄ Developer Mode switch
   Exposes window.App.setMode("clean" | "dev"). */
(function () {
  "use strict";

  const P    = window.PORTFOLIO || {};
  const App  = (window.App = window.App || {});
  const html = document.documentElement;
  const toggle    = document.getElementById("modeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const getMode = () => (html.getAttribute("data-mode") === "dev" ? "dev" : "clean");

  /* keep everything that mirrors the mode in sync */
  function sync() {
    const dev = getMode() === "dev";
    if (toggle) {
      toggle.setAttribute("aria-checked", String(dev));
      toggle.title = dev
        ? "Exit Developer Mode — back to the clean site"
        : "Switch to Developer Mode — the VS Code experience";
    }
    if (themeMeta) themeMeta.setAttribute("content", dev ? "#1e1e1e" : "#07080d");
    if (P.name) {
      const active = document.querySelector(".editor-section.active");
      document.title = dev && active && active.dataset.name
        ? P.name + " — " + active.dataset.name
        : P.name + " — " + (P.title || "Portfolio");
    }
  }

  function apply(mode) {
    html.setAttribute("data-mode", mode);
    try { localStorage.setItem("mode", mode); } catch (_) { /* private mode */ }
    if (mode === "clean") {
      if (location.hash === "#dev") history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo(0, 0);
    }
    sync();
  }

  function setMode(mode) {
    mode = mode === "dev" ? "dev" : "clean";
    if (mode === getMode()) return;

    /* circular reveal from the toggle where the browser supports it */
    if (document.startViewTransition && !reduceMotion.matches && toggle && !document.hidden) {
      const r = toggle.getBoundingClientRect();
      html.style.setProperty("--vt-x", r.left + r.width / 2 + "px");
      html.style.setProperty("--vt-y", r.top + r.height / 2 + "px");
      const vt = document.startViewTransition(() => apply(mode));
      /* a skipped animation still applies the mode — nothing to report */
      vt.ready.catch(() => {});
      vt.finished.catch(() => {});
    } else {
      apply(mode);
    }
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      toggle.classList.remove("nudge");
      setMode(getMode() === "dev" ? "clean" : "dev");
    });

    /* first visit only: a gentle pulse so developers notice the switch */
    try {
      if (!localStorage.getItem("modeSeen")) {
        toggle.classList.add("nudge");
        localStorage.setItem("modeSeen", "1");
      }
    } catch (_) { /* private mode */ }
  }

  /* any element can switch modes: <button data-set-mode="dev"> */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-set-mode]");
    if (el) setMode(el.dataset.setMode);
  });

  /* deep links: #dev opens Developer Mode; #experience etc. scroll to that
     section on the clean site (in Developer Mode js/app.js opens the file) */
  function followHash() {
    const hash = location.hash.replace("#", "");
    if (hash === "dev") setMode("dev");
    else if (hash && getMode() === "clean") window.Clean?.scrollToSection(hash, false);
    else if (hash && App.files?.includes(hash)) App.openFile(hash, false);
  }
  window.addEventListener("hashchange", followHash);
  if (getMode() === "clean") followHash();

  sync();
  App.setMode = setMode;
  App.getMode = getMode;
})();
